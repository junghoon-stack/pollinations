import type { DecisionAnswer } from "@pollinations/sdk";
import { Surface, Text } from "@pollinations/ui";

const percent = new Intl.NumberFormat("ko-KR", {
    style: "percent",
    maximumFractionDigits: 1,
});

export function DecisionAnswerPanel({
    answer,
    question,
}: {
    answer: DecisionAnswer;
    question: string;
}) {
    const probabilities =
        answer.type === "noul"
            ? { 예: answer.noul, 아니요: 1 - answer.noul }
            : answer.probabilities;
    return (
        <Surface
            variant="card"
            className="flex w-full max-w-xl flex-col gap-3"
            aria-label="판단 결과"
        >
            <Text weight="semibold">{question}</Text>
            {answer.type === "choice" && <Text>선택: {answer.choice}</Text>}
            {answer.type === "score" && (
                <Text>점수: {Number(answer.score.toFixed(2))}</Text>
            )}
            <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2">
                {Object.entries(probabilities).map(([key, probability]) => (
                    <div
                        key={key}
                        className="col-span-2 grid grid-cols-subgrid gap-y-1"
                    >
                        <dt className="break-words">
                            {answer.type === "score"
                                ? `${key} · ${String(answer.legend[key] ?? key)}`
                                : key}
                        </dt>
                        <dd className="text-right tabular-nums">
                            {percent.format(probability)}
                        </dd>
                        <div
                            aria-hidden="true"
                            className="col-span-2 h-1 rounded-full bg-theme-bg-subtle"
                        >
                            <div
                                className="h-full rounded-full bg-theme-text-soft"
                                style={{ width: `${probability * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </dl>
        </Surface>
    );
}
