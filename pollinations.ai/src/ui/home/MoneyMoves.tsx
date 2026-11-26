import {
    CardIcon,
    ContentHeader,
    EarningsIcon,
    formatCount,
    Heading,
    IconTile,
    type IconTileProps,
    InlineLink,
    SproutIcon,
    Surface,
    Text,
} from "@pollinations/ui";
import type { ReactNode } from "react";
import { useArt } from "../../art";
import { useQuestLeaderboard } from "../../data/community";

/** How billing works: pay as you go, free Quest credits, and earnings. */
export function MoneyMoves() {
    const scene = useArt("home", "quests");
    const { data: quests } = useQuestLeaderboard();

    return (
        <Surface
            variant="card"
            className="relative flex flex-col overflow-hidden p-5 sm:p-8 lg:min-h-[30rem] lg:justify-center"
        >
            <div className="relative z-10 flex flex-col gap-10 lg:max-w-[46%]">
                <ContentHeader
                    eyebrow={null}
                    title="모든 모델, 에이전트, 도구에 하나의 크레딧."
                />
                <ul className="flex flex-col gap-6">
                    {/* Paid gold and Quest green, as on the wallet; earnings
                        land in both, so that row takes the info blue. */}
                    <Item icon={CardIcon} tone="paid" title="사용한 만큼 지불">
                        필요할 때 충전하고 사용한 만큼만 지불하세요.
                    </Item>
                    <Item icon={SproutIcon} tone="tier" title="무료 크레딧">
                        퀘스트를 완료해 잔액을 늘리세요: GitHub 이슈 해결, 모델
                        체험, 앱이나 에이전트 만들기.{" "}
                        {quests ? (
                            <>
                                이미 {formatCount(quests.totals.contributors)}
                                명이 퀘스트를 완료했습니다.{" "}
                            </>
                        ) : null}
                        <InlineLink href="https://enter.pollinations.ai/quests">
                            퀘스트 둘러보기
                        </InlineLink>
                    </Item>
                    <Item icon={EarningsIcon} tone="info" title="수익">
                        다른 사람이 내{" "}
                        <InlineLink href="https://gen.pollinations.ai/docs#tag/publish-a-model">
                            모델
                        </InlineLink>{" "}
                        과{" "}
                        {/* Keep the link's arrow and the full stop on its line. */}
                        <span className="whitespace-nowrap">
                            <InlineLink href="https://gen.pollinations.ai/docs#tag/pollinations-pay">
                                앱
                            </InlineLink>
                            에 쓰는 금액의 일부를 받으세요.
                        </span>
                    </Item>
                </ul>
            </div>
            {/* Under the copy on phones, reaching the card's edges; the right
                side of the card on wide screens. */}
            <img
                src={scene.src}
                srcSet={scene.srcSet}
                sizes="(min-width: 1024px) 640px, 100vw"
                alt=""
                aria-hidden="true"
                width={2048}
                height={1024}
                loading="lazy"
                decoding="async"
                className="first-call-scene pointer-events-none -mx-5 -mb-5 mt-8 h-auto w-[calc(100%+2.5rem)] max-w-none select-none sm:-mx-8 sm:-mb-8 sm:w-[calc(100%+4rem)] lg:absolute lg:right-0 lg:bottom-0 lg:m-0 lg:w-[58%]"
            />
        </Surface>
    );
}

function Item({
    icon,
    tone,
    title,
    children,
}: {
    icon: IconTileProps["icon"];
    tone?: IconTileProps["tone"];
    title: string;
    children: ReactNode;
}) {
    return (
        <li className="flex gap-4">
            <IconTile icon={icon} tone={tone} />
            <div className="flex flex-col gap-1">
                <Heading as="h3" size="card">
                    {title}
                </Heading>
                <Text size="sm">{children}</Text>
            </div>
        </li>
    );
}
