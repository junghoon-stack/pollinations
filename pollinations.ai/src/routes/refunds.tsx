import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "../routeMeta";
import { LegalPage } from "../ui/site/LegalPage";

export const Route = createFileRoute("/refunds")({
    head: () => routeHead("/refunds"),
    component: () => (
        <LegalPage
            markdownPath="/legal/REFUNDS_AND_CANCELLATIONS.md"
            errorLabel="환불 및 취소 정책"
        />
    ),
});
