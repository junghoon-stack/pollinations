import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "../routeMeta";
import { LegalPage } from "../ui/site/LegalPage";

export const Route = createFileRoute("/privacy")({
    head: () => routeHead("/privacy"),
    component: () => (
        <LegalPage
            markdownPath="/legal/PRIVACY_POLICY.md"
            errorLabel="개인정보 처리방침"
        />
    ),
});
