import { NextRequest, NextResponse } from "next/server";
import { loadMergedCatalog } from "@/lib/catalog";
import type { SkinQuestionnaireAnswers } from "@/lib/skin-questionnaire";
import { emptyQuestionnaire } from "@/lib/skin-questionnaire";
import { runSkinAnalysis } from "@/lib/vilatech-ai/commerce";

export async function POST(req: NextRequest) {
  try {
    const { image, questionnaire } = await req.json();

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    const answers: SkinQuestionnaireAnswers = {
      ...emptyQuestionnaire(),
      ...(questionnaire && typeof questionnaire === "object" ? questionnaire : {}),
    };

    const catalog = await loadMergedCatalog(true);
    const result = await runSkinAnalysis(image, catalog, answers);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Skin analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyse skin. Please try again." },
      { status: 500 }
    );
  }
}
