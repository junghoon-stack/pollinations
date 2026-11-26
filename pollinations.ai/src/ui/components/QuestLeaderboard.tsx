import {
    Chip,
    ContentHeader,
    EmptyState,
    ExternalLinkButton,
    Heading,
    LinkCard,
    Skeleton,
    SproutIcon,
    StatCard,
    Surface,
    Text,
} from "@pollinations/ui";
import { useQuestLeaderboard } from "../../data/community";

const QUESTS_PAGE_URL = "https://enter.pollinations.ai/quests";
const VISIBLE_CONTRIBUTORS = 8;

function formatNumber(value: number) {
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/** Global Quest totals and the top contributors, with loading and failure states. */
export function QuestLeaderboard() {
    const { data, loading } = useQuestLeaderboard();

    return (
        <section
            aria-busy={!data && loading ? true : undefined}
            className="flex flex-col gap-5"
        >
            <ContentHeader
                eyebrow={null}
                title="퀘스트 리더보드"
                subtitle="퀘스트를 완료하며 Pollinations에 기여하는 사람들."
                action={
                    <ExternalLinkButton
                        href={QUESTS_PAGE_URL}
                        size="md"
                        intent="brand"
                    >
                        퀘스트 둘러보기
                    </ExternalLinkButton>
                }
            />
            {data ? (
                <>
                    <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
                        {(
                            [
                                ["참가자", data.totals.contributors],
                                ["완료된 퀘스트", data.totals.completedQuests],
                            ] as const
                        ).map(([label, value]) => (
                            <Surface key={label} as="div" variant="card">
                                <StatCard
                                    variant="display"
                                    label={label}
                                    value={formatNumber(value)}
                                />
                            </Surface>
                        ))}
                    </div>

                    <ol className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2">
                        {data.leaderboard
                            .slice(0, VISIBLE_CONTRIBUTORS)
                            .map((entry, index) => (
                                <li key={entry.githubLogin}>
                                    <LinkCard
                                        href={`https://github.com/${encodeURIComponent(entry.githubLogin)}`}
                                        showIcon={false}
                                        surfaceClassName="flex-row items-center gap-3 p-3.5 sm:p-4"
                                    >
                                        {/* The top three take the amber accent: a small podium. */}
                                        <Chip
                                            intent={
                                                index < 3
                                                    ? undefined
                                                    : "neutral"
                                            }
                                            size="sm"
                                            aria-label={`순위 ${index + 1}`}
                                            className="w-8"
                                        >
                                            {index + 1}
                                        </Chip>
                                        <img
                                            src={`https://github.com/${encodeURIComponent(entry.githubLogin)}.png?size=64`}
                                            alt=""
                                            aria-hidden="true"
                                            className="size-9 shrink-0 rounded-full bg-theme-bg-subtle"
                                            loading="lazy"
                                            decoding="async"
                                            width={36}
                                            height={36}
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                            <Heading
                                                as="span"
                                                size="card"
                                                className="truncate"
                                            >
                                                @{entry.githubLogin}
                                            </Heading>
                                            <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                                <Text
                                                    as="span"
                                                    size="xs"
                                                    tone="muted"
                                                    className="whitespace-nowrap"
                                                >
                                                    {formatNumber(
                                                        entry.completedQuests,
                                                    )}{" "}
                                                    퀘스트
                                                </Text>
                                                {/* Quest rewards, in the wallet's Quest green, as on the dashboard. */}
                                                <Text
                                                    as="strong"
                                                    size="xs"
                                                    weight="bold"
                                                    className="polli-wallet-text-tier inline-flex items-baseline gap-0.5 whitespace-nowrap tabular-nums"
                                                >
                                                    <SproutIcon
                                                        aria-hidden="true"
                                                        className="size-3.5 self-center"
                                                    />
                                                    $
                                                    {formatNumber(
                                                        entry.totalPollen,
                                                    )}
                                                    <span className="sr-only">
                                                        {" "}
                                                        획득
                                                    </span>
                                                </Text>
                                            </span>
                                        </span>
                                    </LinkCard>
                                </li>
                            ))}
                    </ol>
                </>
            ) : loading ? (
                // The totals and rows at their real sizes, so nothing below
                // moves when the board arrives.
                <>
                    <div className="grid grid-cols-1 gap-3 min-[440px]:grid-cols-2">
                        {[0, 1].map((i) => (
                            <Skeleton key={i} className="h-23.5 sm:h-24.5" />
                        ))}
                    </div>
                    <div className="grid grid-cols-1 gap-3 min-[900px]:grid-cols-2">
                        {[...Array(VISIBLE_CONTRIBUTORS).keys()].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-[70.5px] sm:h-[74.5px]"
                            />
                        ))}
                    </div>
                </>
            ) : (
                <EmptyState>
                    지금은 퀘스트 리더보드를 불러올 수 없습니다.
                </EmptyState>
            )}
        </section>
    );
}
