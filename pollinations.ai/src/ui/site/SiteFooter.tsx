import { BrandMark, Eyebrow, IconButton, InlineLink } from "@pollinations/ui";
import { Link } from "@tanstack/react-router";
import { DOCS_URL, SOCIAL } from "./links";

const COLUMNS = [
    {
        heading: "빌드",
        links: [
            { href: DOCS_URL, label: "문서" },
            { href: "https://enter.pollinations.ai/models", label: "모델" },
            { href: "https://enter.pollinations.ai", label: "대시보드" },
        ],
    },
    {
        heading: "둘러보기",
        links: [
            { to: "/", label: "홈" },
            { to: "/apps", label: "앱" },
            { to: "/play", label: "플레이" },
            { to: "/community", label: "커뮤니티" },
        ],
    },
    {
        heading: "프로젝트",
        links: [
            { to: "/privacy", label: "개인정보" },
            { to: "/terms", label: "이용약관" },
            // Payment providers generally require this to be reachable.
            { to: "/refunds", label: "환불" },
        ],
    },
] as const;

export function SiteFooter() {
    return (
        <footer className="site-shell hidden min-[880px]:block">
            <div className="site-gutter flex flex-wrap justify-between gap-10 pt-11 pb-14">
                <div className="flex max-w-xs flex-col gap-4">
                    <BrandMark className="size-11 text-theme-text-strong" />
                    <p className="text-sm text-theme-text-muted">
                        <span className="block">
                            AI 빌더를 위한 오픈 인프라
                        </span>
                        <span className="block">
                            커뮤니티와 함께, 공개적으로 만듭니다
                        </span>
                    </p>
                    <nav aria-label="소셜 링크" className="flex gap-1">
                        {SOCIAL.map(({ href, label, Icon }) => (
                            <IconButton
                                key={href}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="ghost"
                                size="md"
                                aria-label={label}
                            >
                                <Icon className="h-4 w-4" />
                            </IconButton>
                        ))}
                    </nav>
                    <p className="text-xs text-theme-text-muted">
                        <span className="block">
                            © {new Date().getFullYear()} Myceli.AI OÜ, Tallinn,
                            Estonia
                        </span>
                        <span className="block">
                            Stripe 결제 ·{" "}
                            <InlineLink
                                href="mailto:hello@pollinations.ai"
                                tone="quiet"
                            >
                                hello@pollinations.ai
                            </InlineLink>
                        </span>
                    </p>
                </div>
                <div className="flex flex-wrap gap-12">
                    {COLUMNS.map((column) => (
                        <div
                            key={column.heading}
                            className="flex flex-col gap-2"
                        >
                            <Eyebrow size="chrome">{column.heading}</Eyebrow>
                            {/* One quiet link style; ↗ marks only the ones that leave the site. */}
                            {column.links.map((link) =>
                                "to" in link ? (
                                    <InlineLink
                                        key={link.label}
                                        as={Link}
                                        to={link.to}
                                        external={false}
                                        tone="quiet"
                                        size="footer"
                                        className="w-fit"
                                    >
                                        {link.label}
                                    </InlineLink>
                                ) : (
                                    <InlineLink
                                        key={link.label}
                                        href={link.href}
                                        tone="quiet"
                                        size="footer"
                                        className="w-fit"
                                    >
                                        {link.label}
                                    </InlineLink>
                                ),
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
}
