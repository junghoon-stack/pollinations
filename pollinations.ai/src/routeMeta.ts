type RouteMeta = { title: string; description: string };

export const ROUTE_META: Record<string, RouteMeta> = {
    "/": {
        title: "Pollinations.ai | AI 네이티브를 위한 오픈 인프라. 모델. 에이전트. 도구. 하나의 API.",
        description:
            "AI 네이티브 빌더 커뮤니티. 이미지, 영상, 음성, 음악, 텍스트를 생성하고 에이전트와 앱을 만드세요.",
    },
    "/play": {
        title: "플레이 | pollinations.ai",
        description:
            "브라우저에서 에이전트와 대화하거나 내 잔액으로 이미지, 영상, 오디오를 생성하세요.",
    },
    "/apps": {
        title: "앱 | pollinations.ai",
        description:
            "창의적인 실험부터 대규모로 쓰이는 도구까지, Pollinations 커뮤니티가 등록한 앱을 만나보세요.",
    },
    "/community": {
        title: "커뮤니티 | pollinations.ai",
        description:
            "Pollinations에 기여하고, 아이디어에 투표하고, 빌더들을 만나보세요.",
    },
    "/terms": {
        title: "이용약관 | pollinations.ai",
        description: "pollinations.ai 이용약관",
    },
    "/privacy": {
        title: "개인정보 | pollinations.ai",
        description: "pollinations.ai 개인정보 처리방침",
    },
    "/subprocessors": {
        title: "서비스 제공자 | pollinations.ai",
        description: "pollinations.ai 서비스 제공자",
    },
    "/refunds": {
        title: "환불 | pollinations.ai",
        description: "pollinations.ai 환불 및 취소 정책",
    },
};

export const NOT_FOUND_META: RouteMeta = {
    title: "페이지를 찾을 수 없습니다 | pollinations.ai",
    description: "요청하신 페이지를 찾을 수 없습니다.",
};

// The known page a URL path shows, or undefined for the 404 page. The router
// matches paths in any case and with a trailing slash, so this must too.
export function knownPage(pathname: string): string | undefined {
    const path = (
        pathname !== "/" && pathname.endsWith("/")
            ? pathname.slice(0, -1)
            : pathname
    ).toLowerCase();
    return path in ROUTE_META ? path : undefined;
}

export function routeHead(path?: string) {
    const known = path ? ROUTE_META[path] : undefined;
    const meta = known ?? NOT_FOUND_META;
    const canonical = known
        ? `https://pollinations.ai${path === "/" ? "" : path}`
        : null;
    const jsonLd = path ? getJsonLd(path) : null;
    return {
        meta: [
            { title: meta.title },
            { name: "description", content: meta.description },
            { property: "og:title", content: meta.title },
            { property: "og:description", content: meta.description },
            { name: "twitter:title", content: meta.title },
            { name: "twitter:description", content: meta.description },
            ...(canonical ? [{ property: "og:url", content: canonical }] : []),
        ],
        links: canonical ? [{ rel: "canonical", href: canonical }] : [],
        scripts: jsonLd
            ? [{ type: "application/ld+json", children: jsonLd }]
            : [],
    };
}

export function getJsonLd(path: string): string | null {
    if (path === "/")
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "pollinations.ai",
            url: "https://pollinations.ai",
            logo: "https://pollinations.ai/icon-512.png",
            sameAs: [
                "https://github.com/pollinations",
                "https://discord.gg/k9F7SyTgqn",
                "https://x.com/pollinations_ai",
            ],
            description: ROUTE_META["/"].description,
        });
    if (path === "/play")
        return JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Pollinations Play",
            url: "https://pollinations.ai/play",
            applicationCategory: "MultimediaApplication",
            description: ROUTE_META["/play"].description,
        });
    return null;
}
