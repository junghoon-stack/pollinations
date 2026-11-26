import type { ModelInfo } from "@pollinations/sdk";

// Play also reads this optional metadata from catalogs ahead of its installed SDK.
type PreviewFormat = {
    mode: string;
    input_modalities?: string[];
    frame_defaults?: { frame_count: number; frame_duration_ms: number };
};
export type PreviewFormats = Record<string, PreviewFormat>;
export type ImageFormats = Record<
    string,
    PreviewFormat & {
        mode: "default" | "native" | "selectable";
        input_modalities: string[];
    }
>;

export function previewImageFormats(
    model: ModelInfo & { output_formats?: ImageFormats },
    preview?: PreviewFormats,
): ImageFormats | undefined {
    if (model.output_formats || !preview) return model.output_formats;
    const formats: ImageFormats = {};
    for (const [key, entry] of Object.entries(preview)) {
        const { mode } = entry;
        if (mode === "default" || mode === "selectable" || mode === "native")
            formats[key] = {
                ...entry,
                mode,
                input_modalities:
                    entry.input_modalities ?? model.input_modalities ?? [],
            };
    }
    return formats;
}

export function imageFormatLabel(value: string) {
    if (value === "webp") return "WebP";
    if (value === "still") return "모델 기본값";
    return value.toUpperCase();
}

export const imageMime = {
    gif: "image/gif",
    svg: "image/svg+xml",
    png: "image/png",
    webp: "image/webp",
    jpeg: "image/jpeg",
} as const;
type Format = keyof typeof imageMime;
const formats = Object.keys(imageMime) as Format[];
const requestFormats = ["png", "webp", "gif"] as const;

export function imageActionLabel(editsImage: boolean, format?: Format) {
    if (editsImage) return "이미지 편집";
    return format ? `${format.toUpperCase()} 생성` : "이미지 생성";
}

/** Keep the returned image and use its media type for the preview and download. */
export function imageResult(
    { buffer, contentType }: { buffer: ArrayBuffer; contentType: string },
    expected?: Format,
) {
    const mime = contentType.split(";")[0].trim().toLowerCase();
    if (!mime.startsWith("image/") || !mime.slice(6)) {
        return {
            type: "file" as const,
            url: URL.createObjectURL(
                new Blob([buffer], { type: "application/octet-stream" }),
            ),
            filename: "pollinations-playground.bin",
            notice: mime
                ? `미리보기를 표시할 수 없습니다. 모델이 ${mime}을 반환했습니다.`
                : "미리보기를 표시할 수 없습니다. 응답에 미디어 타입이 없습니다.",
        };
    }
    const actual = formats.find((key) => imageMime[key] === mime);
    const label = actual && imageFormatLabel(actual);
    const extension = actual === "jpeg" ? "jpg" : (actual ?? mime.slice(6));
    return {
        type: "image" as const,
        url: URL.createObjectURL(new Blob([buffer], { type: mime })),
        filename: `pollinations-playground.${extension}`,
        formatLabel: label,
        notice:
            expected && expected !== actual
                ? `요청한 형식은 ${imageFormatLabel(expected)}이고, 모델은 ${label ?? mime}을 반환했습니다.`
                : undefined,
    };
}

// Native outputs use the ordinary image request. The SDK can explicitly
// request GIF, PNG and WebP when the model advertises them.
export function imageOutput(
    formatsByName: ImageFormats | undefined,
    selected?: string,
) {
    const native = formats.find(
        (key) => formatsByName?.[key]?.mode === "native",
    );
    const defaultFormat = formats.find(
        (key) => formatsByName?.[key]?.mode === "default",
    );
    const choices = requestFormats.filter(
        (key) => formatsByName?.[key]?.mode === "selectable",
    );
    const selectedFormat = native
        ? undefined
        : choices.find((key) => key === selected);
    const format = native ?? selectedFormat ?? defaultFormat;
    const info = format ? formatsByName?.[format] : undefined;
    const request = selectedFormat
        ? {
              outputFormat: selectedFormat,
              ...(selectedFormat === "gif" && {
                  frameCount: info?.frame_defaults?.frame_count,
                  frameDurationMs: info?.frame_defaults?.frame_duration_ms,
              }),
          }
        : undefined;
    return {
        format,
        info,
        options: native
            ? [native]
            : defaultFormat
              ? [defaultFormat, ...choices]
              : choices.length
                ? ["still", ...choices]
                : [],
        request,
    };
}
