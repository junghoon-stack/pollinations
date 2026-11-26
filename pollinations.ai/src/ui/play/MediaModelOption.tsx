import { Chip } from "@pollinations/ui";
import { ModelBrandIcon } from "@pollinations/ui/gen";
import { WalletKindIcon } from "@pollinations/ui/wallet";
import { isNewModel } from "../../../../shared/model-recency";

export function MediaModelOption({
    model,
    showPricing = true,
    perDollar,
}: {
    showPricing?: boolean;
    perDollar?: string;
    model: {
        title: string;
        paidOnly: boolean;
        publisher?: string;
        addedDate?: number;
    };
}) {
    return (
        <span className="flex w-full min-w-0 items-center gap-2">
            <ModelBrandIcon
                model={model}
                className="size-4 shrink-0 text-theme-text-muted"
            />
            <span className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate">{model.title}</span>
                {isNewModel(model.addedDate) && (
                    <Chip intent="success" size="sm" className="play-model-new">
                        신규
                    </Chip>
                )}
            </span>
            {showPricing && (
                <span className="inline-flex shrink-0 items-center text-xs font-normal tabular-nums text-theme-text-muted">
                    <span
                        title={
                            perDollar && perDollar !== "무료"
                                ? "최근 7일간 성공한 유료 요청의 중간 비용을 기준으로 한 $1당 예상 요청 수입니다."
                                : undefined
                        }
                    >
                        {perDollar ?? (
                            <>
                                <span aria-hidden="true">—</span>
                                <span className="sr-only">예상값 없음</span>
                            </>
                        )}
                    </span>
                    <span
                        role="img"
                        aria-label={
                            model.paidOnly
                                ? "유료 잔액만 사용"
                                : "모든 잔액 사용 가능"
                        }
                        className="inline-flex w-9 justify-center"
                    >
                        <WalletKindIcon
                            kind={model.paidOnly ? "paid" : "tier"}
                        />
                    </span>
                </span>
            )}
        </span>
    );
}
