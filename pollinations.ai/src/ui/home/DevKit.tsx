import type { ModelCategory } from "@pollinations/sdk";
import {
    AppIcon,
    AudioIcon,
    BeakerIcon,
    BookIcon,
    ChatIcon,
    Chip,
    CloudUploadIcon,
    ContentHeader,
    cn,
    ExternalLinkButton,
    ExternalLinkIcon,
    formatCount,
    GlobeIcon,
    Heading,
    type IconProps,
    IconTile,
    ImageIcon,
    LinkCard,
    LockIcon,
    McpIcon,
    RobotIcon,
    SearchIcon,
    SproutIcon,
    Surface,
    TerminalIcon,
    Text,
    VideoIcon,
    WalletIcon,
} from "@pollinations/ui";
import { modalityBgVar, modalityTextColor } from "@pollinations/ui/gen";
import { PaidChip } from "@pollinations/ui/wallet";
import type { ComponentType, ReactNode } from "react";
import { LINKS } from "../../copy/content/socialLinks";
import { useMcpServers, usePlatformStats } from "../../data/publicStats";

type Feature = {
    title: string;
    /** Short copy; wrap the phrase worth skimming in <Em>. */
    body: ReactNode;
    /** A line under the title: a live catalog count, or a fixed note. */
    catalogCount?: "agents";
    note?: string;
    /** Pills shown between the header and the body. */
    chips?: string[];
    links: { label: string; href: string }[];
    icon: ComponentType<IconProps>;
    /** Live detail shown between the header and the body. */
    detail?: ComponentType<{ color?: string }>;
    /** The icon's colour, from the Models cards; without one the card takes
     * the wallet's paid gold, like the Community card. */
    color?: string;
    /** A Models-card background, for the publish cards. */
    tint?: string;
};

/** The phrase a skimming reader should catch in a card's copy. */
function Em({ children }: { children: ReactNode }) {
    return (
        <Text as="strong" size="sm" tone="strong" weight="semibold">
            {children}
        </Text>
    );
}

// Agents and tools lead, after the Models section, mirroring the headline's
// models, agents, tools.
const BUILD_FEATURES: Feature[] = [
    {
        title: "에이전트",
        catalogCount: "agents",
        chips: ["프롬프트 + 도구", "코드 (agent.ts)", "내 서버"],
        body: (
            <>
                <Em>에이전트를 모델처럼 호출</Em>하거나 직접 만드세요. 프롬프트
                에이전트와 코드 에이전트를 호스팅합니다.
            </>
        ),
        links: [
            {
                label: "에이전트 둘러보기",
                href: "https://enter.pollinations.ai/agents",
            },
        ],
        icon: RobotIcon,
        color: "var(--polli-color-modality-audio)",
    },
    {
        title: "샌드박스",
        chips: ["SSH", "VS Code", "E2B 또는 Azure"],
        body: (
            <>
                나나 내 에이전트를 위한 <Em>클라우드 리눅스 컴퓨터</Em>.
                일시정지된 샌드박스는 비용이 들지 않습니다.
            </>
        ),
        links: [
            {
                label: "샌드박스 열기",
                href: "https://enter.pollinations.ai/sandboxes",
            },
            {
                label: "샌드박스 가이드",
                href: "https://gen.pollinations.ai/docs#tag/sandboxes",
            },
        ],
        icon: TerminalIcon,
        color: "var(--polli-color-modality-realtime)",
    },
    {
        title: "호스팅 MCP 도구",
        body: (
            <>
                Gmail 같은 <Em>연결된 앱, 웹 검색, 프라이빗 컴퓨터</Em>. 내
                에이전트나 어떤 MCP 클라이언트에서든 사용하세요.
            </>
        ),
        links: [
            {
                label: "MCP 서버 둘러보기",
                href: "https://enter.pollinations.ai/agents?view=mcp",
            },
        ],
        icon: McpIcon,
        color: "var(--polli-color-modality-video)",
        detail: McpServers,
    },
    {
        title: "Pollinations CLI",
        note: "사람, AI 에이전트, 그 사이 모든 것을 위해",
        chips: ["npx @pollinations/cli"],
        body: (
            <>
                <Em>이 작업 중 하나로 시작</Em>한 뒤 키, 모델, 사용량, 수익을
                살펴보세요.
            </>
        ),
        links: [
            {
                label: "OpenCode 연결",
                href: "https://github.com/pollinations/pollinations/blob/main/packages/polli-cli/TASKS.md#connect-opencode",
            },
            {
                label: "이미지 생성",
                href: "https://github.com/pollinations/pollinations/blob/main/packages/polli-cli/TASKS.md#generate-an-image-from-the-terminal",
            },
        ],
        icon: TerminalIcon,
        color: "var(--polli-color-modality-text)",
    },
    {
        title: "사이트 호스팅",
        chips: ["무료", "정적"],
        body: (
            <>
                <span className="whitespace-nowrap">
                    your-name.pollinations.app
                </span>
                에서 <Em>사이트를 무료로 호스팅</Em>하세요. CLI, SDK,
                에이전트에서 게시할 수 있습니다.
            </>
        ),
        links: [
            {
                label: "pollinations.app 방문",
                href: "https://pollinations.app",
            },
            {
                label: "사이트 가이드",
                href: "https://gen.pollinations.ai/docs#tag/sites",
            },
        ],
        icon: GlobeIcon,
        color: "var(--polli-color-modality-embedding)",
    },
    {
        title: "사용자가 결제",
        chips: ["BYOP", "수익"],
        body: (
            <>
                Pollinations Pay를 쓰면 사용자가 계정을 연결하고 지출 한도를
                정합니다. <Em>사용한 만큼 본인이 결제합니다.</Em>
            </>
        ),
        links: [
            {
                label: "연동 가이드",
                href: "https://gen.pollinations.ai/docs#tag/pollinations-pay",
            },
        ],
        icon: WalletIcon,
    },
    {
        title: "미디어 저장소",
        chips: ["이미지", "오디오", "영상"],
        body: (
            <>
                <Em>이미지, 오디오, 영상을 업로드</Em>해 모델 호출에 쓸 링크를
                받으세요. 생성된 파일도 링크를 받습니다.
            </>
        ),
        links: [
            {
                label: "저장소 가이드",
                href: "https://gen.pollinations.ai/docs#tag/media-storage",
            },
        ],
        icon: CloudUploadIcon,
        color: "var(--polli-color-modality-image)",
    },
    {
        title: "안전 검사",
        chips: ["개인정보", "비밀키", "NSFW", "프롬프트 공격"],
        body: (
            <>
                모델에 도달하기 전에 <Em>개인정보와 키를 제거</Em>하거나{" "}
                <Em>안전하지 않은 프롬프트를 차단</Em>하세요. 요청마다 검사를 켤
                수 있습니다.
            </>
        ),
        links: [
            {
                label: "안전 가이드",
                href: "https://gen.pollinations.ai/docs#tag/safety",
            },
        ],
        icon: LockIcon,
        color: "var(--polli-color-modality-embedding)",
    },
];

/** Most-used kind first; counts and names come from the live catalog. */
const MODEL_KINDS: {
    label: string;
    icon: ComponentType<IconProps>;
    /** Catalog categories; the first one is the enter filter and the color. */
    categories: ModelCategory[];
}[] = [
    { label: "이미지", icon: ImageIcon, categories: ["image"] },
    { label: "텍스트", icon: ChatIcon, categories: ["text", "decision"] },
    { label: "오디오", icon: AudioIcon, categories: ["audio", "realtime"] },
    { label: "영상 & 3D", icon: VideoIcon, categories: ["video", "3d"] },
    { label: "임베딩", icon: SearchIcon, categories: ["embedding"] },
];

const PUBLISH_FEATURES: Feature[] = [
    {
        title: "앱 등록",
        body: (
            <>
                검토를 위해 제출해 앱 카탈로그에 참여하고 <Em>수익을 켜세요</Em>
                .
            </>
        ),
        links: [{ label: "앱 제출하기", href: LINKS.githubSubmitApp }],
        icon: AppIcon,
        color: modalityTextColor("video"),
        tint: modalityBgVar("video"),
    },
    {
        title: "모델 게시",
        body: (
            <>
                엔드포인트를 연결하고 <Em>가격을 설정</Em>하세요. 호출할 때마다
                잔액이 늘어납니다.
            </>
        ),
        links: [
            {
                label: "모델 추가",
                href: "https://enter.pollinations.ai/my-models?tab=models",
            },
        ],
        icon: BeakerIcon,
        color: modalityTextColor("text"),
        tint: modalityBgVar("text"),
    },
    {
        title: "에이전트 게시",
        body: (
            <>
                에이전트를 카탈로그에 추가해 <Em>누구나 호출</Em>할 수 있게
                하세요.
            </>
        ),
        links: [
            {
                label: "에이전트 만들기",
                href: "https://enter.pollinations.ai/my-models",
            },
        ],
        icon: RobotIcon,
        color: modalityTextColor("audio"),
        tint: modalityBgVar("audio"),
    },
];

function FeatureCard({
    feature,
    countLabel,
}: {
    feature: Feature;
    countLabel?: string;
}) {
    const Detail = feature.detail;

    return (
        <Surface
            variant="card"
            className="flex h-full flex-col gap-5 p-5 sm:p-6"
        >
            <div className="flex items-center gap-3">
                <IconTile
                    icon={feature.icon}
                    color={feature.color}
                    tone="paid"
                />
                <div className="flex min-w-0 flex-col gap-1">
                    <Heading as="h3" size="card">
                        {feature.title}
                    </Heading>
                    {feature.catalogCount || feature.note ? (
                        <Text
                            size="xs"
                            tone="muted"
                            className="min-h-4 tabular-nums"
                        >
                            {countLabel ?? feature.note}
                        </Text>
                    ) : null}
                </div>
            </div>

            {feature.chips ? (
                <ChipList names={feature.chips} color={feature.color} />
            ) : null}
            {Detail ? <Detail color={feature.color} /> : null}

            <Text size="sm">{feature.body}</Text>

            <div className="mt-auto flex flex-wrap gap-2">
                {feature.links.map((link) => (
                    <ExternalLinkButton
                        key={link.href}
                        href={link.href}
                        size="md"
                        intent="neutral"
                        icon={
                            link.href.startsWith(
                                "https://gen.pollinations.ai/docs",
                            ) ? (
                                <BookIcon
                                    aria-hidden="true"
                                    className="size-4 shrink-0"
                                />
                            ) : undefined
                        }
                        className="max-w-full whitespace-normal text-left"
                    >
                        {link.label}
                    </ExternalLinkButton>
                ))}
            </div>
        </Surface>
    );
}

/**
 * The models section: one card per official kind, then one for the
 * community, each linking to the matching filter on enter. Laid out like the
 * wallet's balance cards, tinted with the modality colors and the wallet's
 * gold. Counts and the two newest models are live.
 */
function Models() {
    const { data: stats } = usePlatformStats();
    const cards = [
        ...MODEL_KINDS.map(({ label, icon, categories }) => ({
            label,
            icon,
            href: `https://enter.pollinations.ai/models?category=${categories[0]}`,
            count: stats
                ? categories.reduce(
                      (sum, category) => sum + (stats.kinds[category] ?? 0),
                      0,
                  )
                : null,
            names: categories.flatMap(
                (category) => stats?.newest[category] ?? [],
            ),
            color: modalityTextColor(categories[0]),
            background: modalityBgVar(categories[0]),
        })),
        {
            label: "커뮤니티",
            icon: SproutIcon,
            href: "https://enter.pollinations.ai/models?q=source:community",
            count: stats?.community ?? null,
            names: stats?.newest.community ?? [],
            // The wallet's Paid card colors: the brand gold, softened.
            color: "var(--polli-color-paid-deep)",
            background: "var(--polli-color-paid-pale)",
        },
    ];

    return (
        <FeatureGroup
            title="모델"
            description="공식 제공자와 커뮤니티에서. 내 모델도 추가할 수 있습니다."
        >
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {cards.map(
                    ({
                        label,
                        icon: Icon,
                        href,
                        count,
                        names,
                        color,
                        background,
                    }) => (
                        <li key={label}>
                            <LinkCard
                                href={href}
                                surfaceClassName="gap-0 p-3.5 sm:p-5"
                                tint={background}
                            >
                                <span
                                    className="flex items-center gap-2"
                                    style={{ color }}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-3.5 shrink-0"
                                    />
                                    <span className="font-bold text-sm uppercase tracking-wide">
                                        {label}
                                    </span>
                                </span>
                                <span
                                    className="mt-1 min-h-9 font-heading text-4xl leading-none tabular-nums sm:min-h-12 sm:text-5xl"
                                    style={{ color }}
                                >
                                    {count}
                                </span>
                                <Text size="sm" tone="muted" className="mt-1.5">
                                    {names.length > 0 ? (
                                        <>
                                            <span
                                                className="font-semibold"
                                                style={{ color }}
                                            >
                                                최신:
                                            </span>{" "}
                                            {names.slice(0, 2).join(" · ")}
                                        </>
                                    ) : null}
                                </Text>
                            </LinkCard>
                        </li>
                    ),
                )}
            </ul>
            <ExternalLinkButton
                href="https://gen.pollinations.ai/docs"
                size="md"
                intent="neutral"
                icon={
                    <BookIcon aria-hidden="true" className="size-4 shrink-0" />
                }
                className="self-start"
            >
                API 둘러보기
            </ExternalLinkButton>
        </FeatureGroup>
    );
}

/** The hosted servers, live from gen. Nothing shows until they load. */
function McpServers({ color }: { color?: string }) {
    const { data: servers } = useMcpServers();
    if (servers.length === 0) return null;
    return <ChipList names={servers} color={color} />;
}

/** Labels in the card's icon colour: the icon tile's wash, darker text. */
function ChipList({ names, color }: { names: string[]; color?: string }) {
    return (
        <ul className="flex flex-wrap gap-2">
            {names.map((name) => (
                <li key={name}>
                    {color ? (
                        <Chip
                            size="md"
                            style={{
                                backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
                                color: `color-mix(in oklab, ${color} 60%, var(--polli-color-text-strong))`,
                            }}
                        >
                            {name}
                        </Chip>
                    ) : (
                        <PaidChip size="md">{name}</PaidChip>
                    )}
                </li>
            ))}
        </ul>
    );
}

/**
 * A publish card, a link like the Models cards: tinted, its icon in the
 * card's colour, the whole card clickable with its call to action on top.
 */
function PublishCard({ feature }: { feature: Feature }) {
    const Icon = feature.icon;
    const [link] = feature.links;

    return (
        <LinkCard
            href={link.href}
            tint={feature.tint}
            showIcon={false}
            surfaceClassName="gap-3 p-5 sm:p-6"
        >
            {/* The call to action and its arrow, top right. */}
            <div className="mb-1 flex items-start justify-between gap-2">
                <Icon
                    aria-hidden="true"
                    className="size-10 shrink-0"
                    style={{ color: feature.color }}
                />
                {/* Ink like a link, amber when the card is hovered. */}
                <span className="flex items-center gap-1 text-right text-sm font-semibold text-theme-text-strong transition-colors [a:hover_&]:text-theme-text-soft">
                    {link.label}
                    <ExternalLinkIcon
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                    />
                </span>
            </div>
            <Heading as="h3" size="card">
                {feature.title}
            </Heading>
            <Text size="sm">{feature.body}</Text>
        </LinkCard>
    );
}

function FeatureGroup({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="flex flex-col gap-5">
            <ContentHeader
                eyebrow={null}
                title={title}
                subtitle={description}
            />
            {children}
        </section>
    );
}

export function DevKit({ className }: { className?: string }) {
    const { data } = usePlatformStats();

    return (
        <section className={cn("flex flex-col gap-10", className)}>
            <Models />

            <FeatureGroup
                title="필요한 조각을 고르세요."
                description="에이전트, 샌드박스, 도구에 사이트 호스팅, 저장소, 결제, 안전까지."
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {BUILD_FEATURES.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            countLabel={
                                data && feature.catalogCount === "agents"
                                    ? formatCount(data.agents)
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </FeatureGroup>

            <FeatureGroup
                title="내 모델, 에이전트, 앱을 사용자에게 선보이세요."
                description="만드는 건 당신이, 로그인·결제·발견은 저희가. 모델과 에이전트 게시는 알파 단계이며 게시자 권한이 필요합니다."
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {PUBLISH_FEATURES.map((feature) => (
                        <PublishCard key={feature.title} feature={feature} />
                    ))}
                </div>
            </FeatureGroup>
        </section>
    );
}
