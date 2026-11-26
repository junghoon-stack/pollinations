import { Callout, ExternalLinkButton } from "@pollinations/ui";

/**
 * The closing CTA, at the normal section width, on the same brand-dark band
 * that closes Community, so both pages end on one moment.
 */
export function StartBuilding() {
    return (
        <Callout
            tone="dark"
            title="한 조각부터 시작하세요."
            body="첫 API 키로 작은 퀘스트 보상을 받습니다. 한 번 호출해 보고, 준비되면 게시하세요."
        >
            <ExternalLinkButton
                href="https://enter.pollinations.ai/keys"
                intent="brand"
                size="lg"
            >
                API 키 받기
            </ExternalLinkButton>
            <ExternalLinkButton
                href="https://discord.gg/k9F7SyTgqn"
                intent="neutral"
                size="lg"
            >
                Discord 참여하기
            </ExternalLinkButton>
        </Callout>
    );
}
