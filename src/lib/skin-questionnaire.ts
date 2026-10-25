export interface SkinQuestionnaireAnswers {
  ageRange: string;
  selfReportedSkinType: string;
  concerns: string[];
  routineLevel: string;
  sensitiveSkin: boolean;
  usesSpfDaily: boolean;
  primaryGoal: string;
}

export const SKIN_QUESTION_STEPS = [
  {
    id: "ageRange",
    label: "Your age range",
    type: "single" as const,
    options: ["18–24", "25–34", "35–44", "45–54", "55+"],
  },
  {
    id: "selfReportedSkinType",
    label: "How would you describe your skin?",
    type: "single" as const,
    options: ["Oily", "Dry", "Combination", "Normal", "Sensitive", "Not sure"],
  },
  {
    id: "concerns",
    label: "What would you like to improve?",
    type: "multi" as const,
    max: 3,
    options: [
      "Dullness",
      "Dehydration",
      "Dark spots",
      "Uneven tone",
      "Fine lines",
      "Texture",
      "Large pores",
      "Redness",
      "Dry lips",
      "Breakouts",
    ],
  },
  {
    id: "routineLevel",
    label: "Your current skincare routine",
    type: "single" as const,
    options: ["Minimal (cleanser only)", "Basic (cleanse + moisturise)", "Full (serums + SPF)", "Just starting out"],
  },
  {
    id: "usesSpfDaily",
    label: "Do you wear SPF most days?",
    type: "boolean" as const,
  },
  {
    id: "sensitiveSkin",
    label: "Is your skin easily irritated?",
    type: "boolean" as const,
  },
  {
    id: "primaryGoal",
    label: "Your main goal right now",
    type: "single" as const,
    options: [
      "Glass skin / glow",
      "Deep hydration",
      "Calm redness",
      "Anti-ageing",
      "Sun protection",
      "Simple routine I can stick to",
    ],
  },
] as const;

export function questionnaireToPromptContext(answers: SkinQuestionnaireAnswers): string {
  return [
    `Age range: ${answers.ageRange}`,
    `Self-reported skin type: ${answers.selfReportedSkinType}`,
    `Concerns: ${answers.concerns.join(", ") || "none specified"}`,
    `Routine level: ${answers.routineLevel}`,
    `Sensitive skin: ${answers.sensitiveSkin ? "yes" : "no"}`,
    `Uses SPF daily: ${answers.usesSpfDaily ? "yes" : "no"}`,
    `Primary goal: ${answers.primaryGoal}`,
  ].join("\n");
}

export function mapConcernLabelsToIds(labels: string[]): string[] {
  const map: Record<string, string> = {
    dullness: "dullness",
    dehydration: "dehydration",
    "dark spots": "dark-spots",
    "uneven tone": "uneven-tone",
    "fine lines": "fine-lines",
    texture: "texture",
    "large pores": "large-pores",
    redness: "sensitivity",
    "dry lips": "dry-lips",
    breakouts: "texture",
  };
  return labels
    .map((l) => map[l.toLowerCase()] ?? l.toLowerCase().replace(/\s+/g, "-"))
    .filter(Boolean);
}

export function emptyQuestionnaire(): SkinQuestionnaireAnswers {
  return {
    ageRange: "",
    selfReportedSkinType: "",
    concerns: [],
    routineLevel: "",
    sensitiveSkin: false,
    usesSpfDaily: false,
    primaryGoal: "",
  };
}

export function isQuestionnaireComplete(a: SkinQuestionnaireAnswers): boolean {
  return Boolean(
    a.ageRange &&
      a.selfReportedSkinType &&
      a.concerns.length > 0 &&
      a.routineLevel &&
      a.primaryGoal
  );
}
