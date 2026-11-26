import {
    Button,
    FieldStack,
    IconButton,
    Input,
    PlusIcon,
    XIcon,
} from "@pollinations/ui";

export function DecisionCriteriaFields({
    type,
    values,
    onChange,
}: {
    type: "score" | "choice";
    values: string[];
    onChange: (values: string[]) => void;
}) {
    const isScale = type === "score";
    const item = isScale ? "단계" : "선택지";

    return (
        <FieldStack
            orientation="inline"
            className="[&>div:first-child]:self-start [&>div:first-child]:pt-2"
            label={
                isScale ? (
                    <>
                        척도{" "}
                        <span className="text-xs font-normal text-theme-text-muted">
                            (낮음 → 높음)
                        </span>
                    </>
                ) : (
                    "선택지"
                )
            }
        >
            <div className="flex min-w-0 flex-col items-start gap-2">
                {values.map((value, index) => {
                    // Each input represents an editable slot in the ordered list.
                    const label = `${isScale ? "단계" : "선택지"} ${index + 1}`;
                    return (
                        <div
                            key={label}
                            className="flex w-full min-w-0 items-center gap-2"
                        >
                            <Input
                                aria-label={label}
                                className="min-w-0 flex-1"
                                value={value}
                                onChange={(event) => {
                                    const next = [...values];
                                    next[index] = event.target.value;
                                    onChange(next);
                                }}
                            />
                            {values.length > 2 && (
                                <IconButton
                                    variant="ghost"
                                    aria-label={`${item} ${index + 1} 삭제`}
                                    onClick={() =>
                                        onChange(
                                            values.filter(
                                                (_, i) => i !== index,
                                            ),
                                        )
                                    }
                                >
                                    <XIcon />
                                </IconButton>
                            )}
                        </div>
                    );
                })}
                <Button
                    size="sm"
                    intent="neutral"
                    icon={<PlusIcon />}
                    onClick={() => onChange([...values, ""])}
                >
                    {item} 추가
                </Button>
            </div>
        </FieldStack>
    );
}
