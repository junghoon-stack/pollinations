import {
    AppIcon,
    BeakerIcon,
    Callout,
    Chip,
    CodeIcon,
    ContentHeader,
    cn,
    EmptyState,
    ExternalLinkButton,
    formatCount,
    Heading,
    InlineLink,
    LinkCard,
    LiveDot,
    MegaphoneIcon,
    Skeleton,
    StatCard,
    Surface,
    Text,
} from "@pollinations/ui";
import { OrganizationIcon } from "@pollinations/ui/gen";
import { createFileRoute } from "@tanstack/react-router";
import { useArt } from "../art";
import { LINKS, SOCIAL_LINKS } from "../copy/content/socialLinks";
import {
    SUPPORTERS,
    useContributors,
    useDiscordPresence,
    usePullRequestCount,
    useVotingIssues,
} from "../data/community";
import { useAppDirectory, usePlatformStats } from "../data/publicStats";
import { routeHead } from "../routeMeta";
import { QuestLeaderboard } from "../ui/components/QuestLeaderboard";
import { BottomScene } from "../ui/site/BottomScene";
import { HeroScene, postHeroSpacingClassName } from "../ui/site/HeroScene";

export const Route = createFileRoute("/community")({
    head: () => routeHead("/community"),
    component: CommunityPage,
});

/** Four ways to contribute, from publishing work to shaping the platform. */
const WAYS_IN = [
    {
        label: "앱",
        icon: AppIcon,
        title: "내 앱 등록",
        body: "만든 것을 공유하고 피드백을 받아 사용자가 발견하게 하세요.",
        cta: {
            label: "앱 등록",
            href: LINKS.githubSubmitApp,
        },
    },
    {
        label: "모델 & 에이전트",
        icon: BeakerIcon,
        title: "모델이나 에이전트 게시",
        body: "내 모델이나 관리형 에이전트를 공개 카탈로그에 올려 빌더들이 쓸 수 있게 하세요.",
        cta: {
            label: "액세스 요청",
            href: "https://github.com/pollinations/pollinations/issues/new?template=community-model-allowlist.yml",
        },
    },
    {
        label: "코드",
        icon: CodeIcon,
        title: "코드와 문서 개선",
        body: "버그를 고치고, 기능을 제안하고, 예제를 다듬거나 풀 리퀘스트를 여세요.",
        cta: {
            label: "GitHub 퀘스트 찾기",
            href: "https://enter.pollinations.ai/quests",
        },
    },
    {
        label: "대화",
        icon: MegaphoneIcon,
        title: "Discord에서 돕기",
        body: "질문에 답하고 실험을 공유하고, 팀에 부족한 점을 알려주세요.",
        cta: { label: "Discord 참여하기", href: SOCIAL_LINKS.discord.url },
    },
];

/** Loading skeleton, or a note saying which feed failed or is empty. */
function FeedState({
    loading,
    failed,
    what,
}: {
    loading: boolean;
    failed: boolean;
    what: string;
}) {
    if (loading) return <Skeleton className="h-14" />;
    return (
        <EmptyState>
            {failed
                ? `${what}을(를) 지금 불러올 수 없습니다.`
                : `아직 ${what}이(가) 없습니다.`}
        </EmptyState>
    );
}

// Only the Discord count is "right now"; the other metrics are totals.
const LIVE_METRIC = "Discord 온라인";

/** A live count hides when its feed fails and shows a skeleton while loading. */
function liveMetric<T>(
    label: string,
    {
        data,
        loading,
        failed,
    }: { data: T | null; loading: boolean; failed: boolean },
    format: (value: T) => string,
) {
    if (failed || (!loading && data === null)) return null;
    return { label, value: loading || data === null ? null : format(data) };
}

function CommunityParticipation() {
    const votesScene = useArt("community", "votes");
    const { data: issues, loading, failed } = useVotingIssues();
    const online = useDiscordPresence();
    const pullRequests = usePullRequestCount();
    const platform = usePlatformStats();
    const apps = useAppDirectory();
    const ways = [
        liveMetric("등록된 앱", { ...apps, data: apps.data.length }, String),
        liveMetric("커뮤니티 모델과 에이전트", platform, (stats) =>
            formatCount(stats.community + stats.agents),
        ),
        liveMetric("머지된 PR", pullRequests, formatCount),
        // The widget only exposes who is online now; a member total needs
        // a bot token, so this is the one live number the card can show.
        liveMetric(LIVE_METRIC, online, formatCount),
    ].map((metric, index) => ({ ...WAYS_IN[index], metric }));

    return (
        <>
            <HeroScene page="community">
                <ContentHeader
                    eyebrow="오픈 소스, 오픈 로드맵"
                    title="커뮤니티"
                    subtitle={
                        <>
                            <strong>빌더가 플랫폼을 직접 만듭니다.</strong>{" "}
                            필요한 것을 공유하고, 이미 쓰고 있는 사람들을
                            만나고, 다음 단계를 함께 정하세요.
                        </>
                    }
                    variant="page"
                />
            </HeroScene>

            {/* No panel here: the sheet is already the block, so a panel only
                cut a seam through the hero art and indented the headings. */}
            <section
                className={cn(
                    postHeroSpacingClassName,
                    "flex flex-col gap-6 pt-5 sm:pt-6",
                )}
            >
                <ContentHeader
                    eyebrow="참여하기"
                    title="Pollinations를 함께 만들어요"
                    subtitle="작업을 공유하고, 기여하고, 다음에 무엇을 만들지 함께 정하세요."
                />
                <div className="grid grid-cols-1 gap-5 min-[900px]:grid-cols-2 xl:grid-cols-4">
                    {ways.map((way) => {
                        const WayIcon = way.icon;

                        return (
                            <Surface
                                variant="card"
                                key={way.label}
                                className="p-5 sm:p-6 xl:p-5"
                            >
                                <div className="grid h-full content-between gap-4 min-[540px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[900px]:grid-cols-1">
                                    <div className="flex flex-col gap-2.5">
                                        <Chip
                                            intent="neutral"
                                            size="sm"
                                            className="self-start"
                                        >
                                            <WayIcon className="size-3.5" />
                                            {way.label}
                                        </Chip>
                                        <Heading as="h3" size="card">
                                            {way.title}
                                        </Heading>
                                        <Text size="sm">{way.body}</Text>
                                    </div>
                                    <div className="flex flex-col items-start justify-end gap-3 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between xl:flex-col xl:items-start">
                                        {way.metric && (
                                            <StatCard
                                                variant="display"
                                                value={
                                                    way.metric.value ?? (
                                                        <Skeleton
                                                            shape="text"
                                                            className="h-9 w-16"
                                                        />
                                                    )
                                                }
                                                label={
                                                    <>
                                                        {way.metric.label}
                                                        {way.metric.label ===
                                                            LIVE_METRIC &&
                                                            way.metric
                                                                .value && (
                                                                <LiveDot />
                                                            )}
                                                    </>
                                                }
                                            />
                                        )}
                                        {/* self-auto: follow the column's
                                            left edge instead of Button's
                                            default centring. */}
                                        <ExternalLinkButton
                                            href={way.cta.href}
                                            size="md"
                                            intent="brand"
                                            showIcon
                                            className="self-auto whitespace-nowrap"
                                        >
                                            {way.cta.label}
                                        </ExternalLinkButton>
                                    </div>
                                </div>
                            </Surface>
                        );
                    })}
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-5">
                    <div className="min-w-0 flex-1 basis-80">
                        {issues.length === 0 ? (
                            <FeedState
                                loading={loading}
                                failed={failed}
                                what="열린 투표"
                            />
                        ) : (
                            <div className="flex flex-col gap-4">
                                {issues.map((issue) => (
                                    <InlineLink
                                        key={issue.number}
                                        href={issue.url}
                                        aria-label={`“${issue.title}” 열고 투표하기`}
                                        className="flex w-fit max-w-full items-center gap-2"
                                    >
                                        <MegaphoneIcon
                                            aria-hidden="true"
                                            className="size-4 shrink-0"
                                        />
                                        <span className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                            <span className="font-semibold leading-snug text-theme-text-strong">
                                                {issue.title}
                                            </span>
                                            <span className="whitespace-nowrap text-xs text-theme-text-muted tabular-nums">
                                                반응 {issue.reactions}개
                                            </span>
                                        </span>
                                    </InlineLink>
                                ))}
                            </div>
                        )}
                    </div>
                    <InlineLink
                        href={LINKS.githubNewIssue}
                        size="sm"
                        tone="quiet"
                    >
                        아이디어 제안하기
                    </InlineLink>
                </div>
                <img
                    src={votesScene.src}
                    srcSet={votesScene.srcSet}
                    sizes="(max-width: 1440px) 100vw, 1200px"
                    alt=""
                    aria-hidden="true"
                    width={2048}
                    height={854}
                    loading="lazy"
                    decoding="async"
                    fetchPriority="low"
                    className="bottom-scene pointer-events-none block h-[clamp(12rem,24vw,20rem)] w-full select-none rounded-3xl object-cover object-bottom sm:rounded-block"
                />
            </section>
        </>
    );
}

function Contributors() {
    const { data: people, loading, failed } = useContributors();

    return (
        <section className="flex flex-col gap-5">
            <ContentHeader
                eyebrow="기여자"
                title="상위 코드 기여자"
                subtitle="최근 6개월 동안 머지된 풀 리퀘스트 기준 상위 20명. 사람과 에이전트 모두 포함합니다. 함께하고 싶나요?"
                action={
                    <InlineLink href={SOCIAL_LINKS.github.url}>
                        저장소 열기
                    </InlineLink>
                }
            />
            {people.length === 0 && (
                <FeedState loading={loading} failed={failed} what="기여자" />
            )}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(190px,100%),1fr))] gap-3.5">
                {people.map((person) => (
                    <LinkCard
                        key={person.id}
                        href={person.url}
                        showIcon={false}
                        surfaceClassName="flex-row items-center gap-3.5 p-4"
                    >
                        <img
                            src={person.avatar_url}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            width={40}
                            height={40}
                            className="size-10 shrink-0 rounded-[10px] bg-theme-bg-subtle"
                        />
                        <span className="flex min-w-0 flex-col">
                            <span className="flex min-w-0 items-center gap-1.5">
                                <span className="truncate font-semibold text-sm text-theme-text-strong">
                                    {person.login.replace(/\[bot\]$/, "")}
                                </span>
                                {person.login.endsWith("[bot]") && (
                                    <Chip intent="neutral" size="sm">
                                        에이전트
                                    </Chip>
                                )}
                            </span>
                            <span className="text-xs text-theme-text-muted tabular-nums">
                                머지된 PR {formatCount(person.prs)}개
                            </span>
                        </span>
                    </LinkCard>
                ))}
            </div>
        </section>
    );
}

function CommunityPage() {
    return (
        <>
            <CommunityParticipation />

            <QuestLeaderboard />

            <Contributors />

            <section className="flex flex-col gap-5">
                <ContentHeader
                    eyebrow="서포터"
                    title="GPU를 따뜻하게 유지하는 사람들"
                    subtitle="이들의 크레딧과 인프라가 Pollinations를 계속 운영하게 합니다."
                />
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {SUPPORTERS.map((supporter) => (
                        <LinkCard
                            key={supporter.name}
                            href={supporter.url}
                            aria-label={supporter.name}
                            showIcon={false}
                            surfaceClassName="flex-row items-center gap-2.5 px-3.5 py-2.5"
                        >
                            <OrganizationIcon
                                name={supporter.name}
                                className="size-5 shrink-0 text-theme-text-strong"
                            />
                            <span className="truncate font-body text-sm font-semibold text-theme-text-strong">
                                {supporter.name}
                            </span>
                        </LinkCard>
                    ))}
                </div>
            </section>

            <Callout
                tone="dark"
                title="대화에 참여하세요"
                body="빌더들이 프롬프트를 나누고, 서로의 앱을 디버깅하고, 다음에 무엇을 만들지 알려줍니다."
            >
                <ExternalLinkButton
                    href={SOCIAL_LINKS.discord.url}
                    intent="brand"
                    size="lg"
                >
                    Discord 참여하기
                </ExternalLinkButton>
            </Callout>
            <BottomScene page="community" />
        </>
    );
}
