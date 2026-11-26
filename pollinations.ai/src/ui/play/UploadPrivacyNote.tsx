import { InlineLink, Text } from "@pollinations/ui";
import { Link } from "@tanstack/react-router";

export function UploadPrivacyNote({ id }: { id?: string }) {
    return (
        <Text id={id} size="xs" tone="muted">
            업로드한 파일은 공개되며 일시적으로 저장됩니다.{" "}
            <InlineLink
                as={Link}
                to="/privacy"
                target="_blank"
                rel="noopener noreferrer"
            >
                개인정보
            </InlineLink>
        </Text>
    );
}
