import type { DecisionQuestion } from "@pollinations/sdk";
import { playgroundModelOverride } from "../../data/playground-model-overrides";
import type { PlaySearch } from "../../routes/-play-search";

export const URGENCY_EXAMPLE =
    "내보내기가 두 번 실패했는데 10분 뒤 회의에 써야 해요.";

const questionTypes = ["noul", "choice", "score"] as const;
type QuestionType = DecisionQuestion["type"];
const labels: Record<QuestionType, string> = {
    noul: "예 / 아니요",
    choice: "하나 선택",
    score: "점수",
};
export function questionTypeLabel(type: string) {
    return labels[type as QuestionType];
}

function decisionQuestionTypes(model: string) {
    const verified = playgroundModelOverride(model)?.decisionQuestionTypes;
    return verified
        ? questionTypes.filter((type) => verified.includes(type))
        : ["noul" as const];
}

export function decisionForm(model: string, params: PlaySearch) {
    const types = decisionQuestionTypes(model);
    const type = types.find((type) => type === params.questionType) ?? types[0];
    const instructions =
        params.question ??
        (type === "choice"
            ? "어느 팀이 처리해야 하나요?"
            : type === "score"
              ? "얼마나 긴급한가요?"
              : "긴급한 처리가 필요한가요?");
    const criteria = (
        type === "score"
            ? (params.levels ?? "낮음\n보통\n높음")
            : (params.choices ?? "결제\n기술 지원")
    ).split("\n");
    const options = criteria.map((s) => s.trim()).filter(Boolean);
    let question: (DecisionQuestion & { instructions: string }) | undefined;
    let error: string | undefined;
    if (!type) error = "이 모델에서 확인된 질문 유형이 없습니다.";
    else if (!instructions.trim()) error = "질문을 입력하세요.";
    else if (type === "noul")
        question = { type, instructions: instructions.trim() };
    else if (new Set(options).size !== options.length || options.length < 2)
        error = "서로 다른 선택지를 두 개 이상 입력하세요.";
    else if (type === "choice")
        question = {
            type,
            instructions: instructions.trim(),
            criteria: Object.fromEntries(
                options.map((option) => [option, option]),
            ),
        };
    else
        question = {
            type,
            instructions: instructions.trim(),
            criteria: options,
        };
    return { types, type, instructions, criteria, question, error };
}
