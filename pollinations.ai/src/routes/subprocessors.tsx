import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "../routeMeta";
import { LegalPage } from "../ui/site/LegalPage";

export const Route = createFileRoute("/subprocessors")({
    head: () => routeHead("/subprocessors"),
    component: () => (
        <LegalPage
            markdownPath="/legal/SUBPROCESSORS.md"
            errorLabel="서비스 제공업체 고지"
        />
    ),
});
