import type {
    AudioBinaryResponse,
    Pollinations,
    StemSeparationOptions,
} from "@pollinations/sdk";
import {
    type AudioCatalogMetadata,
    playgroundModelOverride,
} from "../../data/playground-model-overrides";
import { audioEndpoint, audioRoute, audioTaskIds } from "./audio-endpoint";

type AudioModel = {
    id: string;
    inputModalities: string[];
    supportedEndpoints: string[];
    transcriptionOptions?: AudioCatalogMetadata["transcription_options"];
};

export function audioTaskForModel(
    model: Pick<AudioModel, "id" | "supportedEndpoints">,
) {
    const route = audioRoute(model);
    if (!route) return undefined;
    const matches: readonly string[] = route[1];
    // Several operations share the speech endpoint. Only use a model override
    // when the operation also matches its current catalog endpoint.
    const preferred = playgroundModelOverride(model.id)?.audioTask;
    const selected =
        preferred && matches.includes(preferred) ? preferred : matches[0];
    return audioTaskIds.find((task) => task === selected);
}

export function transcriptionControls(model: AudioModel) {
    const options = model.transcriptionOptions;
    return {
        language: options?.includes("language") ?? true,
        prompt: options?.includes("prompt") ?? true,
    };
}

export function supportsAudioLength(model: {
    id: string;
    allowedDurations: number[];
}) {
    if (model.allowedDurations.length) return model.allowedDurations.length > 1;
    return !playgroundModelOverride(model.id)?.durationFromInput;
}

export const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".mkv"];

// Some browsers leave `type` empty (e.g. .mkv), so fall back to the extension.
export const isVideo = (file: File) =>
    file.type
        ? file.type.startsWith("video/")
        : VIDEO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

export function audioInputError(
    model: AudioModel,
    prompt: string,
    file?: File,
): string | null {
    const endpoint = audioEndpoint(model);
    if (!endpoint)
        return "이 오디오 엔드포인트는 아직 플레이그라운드에서 지원하지 않습니다.";
    const generatesAudio =
        endpoint === "/v1/audio/speech" || endpoint === "/audio/{text}";
    if (!generatesAudio && !file)
        return model.inputModalities.includes("video")
            ? "먼저 오디오나 비디오 파일을 올려 주세요."
            : "먼저 오디오 파일을 올려 주세요.";
    if (generatesAudio && !prompt.trim())
        return "먼저 텍스트나 설명을 입력하세요.";
    if (
        generatesAudio &&
        !file &&
        model.inputModalities.includes("video") &&
        !model.inputModalities.includes("audio")
    )
        return "먼저 비디오를 올려 주세요.";
    const kind = file && isVideo(file) ? "video" : "audio";
    if (generatesAudio && file && !model.inputModalities.includes(kind))
        return `이 모델은 참조 ${kind === "video" ? "비디오" : "오디오"}를 받지 않습니다.`;
    return null;
}

export type ReferenceUploads = WeakMap<
    File,
    { url: Promise<string>; expires: number }
>;
// Untagged media has a 30-day retention period from upload.
const mediaLifetime = 30 * 24 * 60 * 60 * 1000;

// Cache the pending upload too, so concurrent requests share it. Failed uploads can be retried.
export function uploadReference(
    client: Pollinations,
    file: File,
    urls?: ReferenceUploads,
) {
    const previous = urls?.get(file);
    if (previous && previous.expires > Date.now()) return previous.url;
    const upload = client.upload(file, { name: file.name }).then(
        (result) => result.url,
        (error: unknown) => {
            urls?.delete(file);
            throw error;
        },
    );
    urls?.set(file, { url: upload, expires: Date.now() + mediaLifetime });
    return upload;
}

/**
 * Use the catalog's endpoint contract; never discard a selected file.
 * Callers check audioInputError first.
 */
export async function generatePlaygroundAudio(
    client: Pollinations,
    model: AudioModel,
    {
        prompt,
        file,
        referenceUrls,
        voice,
        duration,
        language,
        stemVariationId,
    }: {
        prompt: string;
        file?: File;
        referenceUrls?: ReferenceUploads;
        voice?: string;
        duration?: number;
        language?: string;
        stemVariationId?: StemSeparationOptions["stemVariationId"];
    },
): Promise<
    | { type: "text"; text: string }
    | { type: "stems"; archive: Blob }
    | ({ type: "audio" } & AudioBinaryResponse)
> {
    const endpoint = audioEndpoint(model);
    if (endpoint === "/v1/audio/transcriptions" && file) {
        const controls = transcriptionControls(model);
        const result = await client.transcribe(file, {
            model: model.id,
            prompt: controls.prompt ? prompt.trim() || undefined : undefined,
            language: controls.language
                ? language?.trim() || undefined
                : undefined,
        });
        return { type: "text", text: result.text || "전사 결과가 없습니다" };
    }
    if (
        (endpoint === "/v1/audio/voice-changer" ||
            endpoint === "/v1/audio/voice-isolator") &&
        file
    ) {
        const result = await client.audioTransform(file, {
            operation:
                endpoint === "/v1/audio/voice-changer"
                    ? "voice-changer"
                    : "voice-isolator",
            model: model.id,
            voice,
        });
        return { type: "audio", ...result };
    }
    if (endpoint === "/alpha/audio/stem-separation" && file) {
        return {
            type: "stems",
            archive: await client.separateStems(file, {
                model: model.id,
                stemVariationId,
            }),
        };
    }
    const options = {
        model: model.id,
        voice,
        duration,
        [file && isVideo(file) ? "referenceVideo" : "referenceAudio"]: file
            ? await uploadReference(client, file, referenceUrls)
            : undefined,
    };
    const result =
        endpoint === "/audio/{text}"
            ? await client.audio(prompt.trim(), options)
            : await client.audioSpeech(prompt.trim(), options);
    return { type: "audio", ...result };
}

type AudioConstraints = NonNullable<
    AudioCatalogMetadata["audio_input_constraints"]
>;

export function audioConstraintError(
    rules: AudioConstraints | undefined,
    files: File[],
    durations: ReadonlyMap<File, number | null>,
    hasVisual: boolean,
) {
    if (!rules || !files.length) return null;
    if (rules.requires_reference_visual && !hasVisual)
        return "오디오와 함께 참조 이미지나 비디오를 추가하세요.";
    if (!rules.min_seconds && !rules.max_seconds && !rules.max_total_seconds)
        return null;
    let total = 0;
    for (const file of files) {
        const seconds = durations.get(file);
        if (seconds === undefined) return "클립 길이를 읽는 중…";
        // The API can decode formats the browser cannot preview.
        if (seconds === null) continue;
        if (rules.min_seconds && seconds < rules.min_seconds)
            return `${file.name}은(는) ${rules.min_seconds}초 이상이어야 합니다.`;
        if (rules.max_seconds && seconds > rules.max_seconds)
            return `${file.name}은(는) ${rules.max_seconds}초 이하여야 합니다.`;
        total += seconds;
    }
    return rules.max_total_seconds && total > rules.max_total_seconds
        ? `오디오는 전체 ${rules.max_total_seconds}초까지만 사용할 수 있습니다.`
        : null;
}
