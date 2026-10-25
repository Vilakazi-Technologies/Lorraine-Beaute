"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  emptyQuestionnaire,
  isQuestionnaireComplete,
  SKIN_QUESTION_STEPS,
  type SkinQuestionnaireAnswers,
} from "@/lib/skin-questionnaire";
import { cn } from "@/lib/utils";

interface SkinQuestionnaireFormProps {
  onComplete: (answers: SkinQuestionnaireAnswers) => void;
  onBack: () => void;
  /** Tighter sticky layout inside the skin-analysis modal */
  variant?: "page" | "modal";
}

export function SkinQuestionnaireForm({
  onComplete,
  onBack,
  variant = "page",
}: SkinQuestionnaireFormProps) {
  const [answers, setAnswers] = useState<SkinQuestionnaireAnswers>(emptyQuestionnaire());
  const [stepIndex, setStepIndex] = useState(0);
  const step = SKIN_QUESTION_STEPS[stepIndex];
  const isLast = stepIndex === SKIN_QUESTION_STEPS.length - 1;

  const canContinue = () => {
    if (!step) return false;
    const key = step.id as keyof SkinQuestionnaireAnswers;
    if (step.type === "multi") {
      return answers.concerns.length > 0;
    }
    if (step.type === "boolean") {
      return true;
    }
    const val = answers[key];
    return typeof val === "string" && val.length > 0;
  };

  const next = () => {
    if (isLast && isQuestionnaireComplete(answers)) {
      onComplete(answers);
      return;
    }
    if (stepIndex < SKIN_QUESTION_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const toggleConcern = (label: string) => {
    setAnswers((prev) => {
      const has = prev.concerns.includes(label);
      if (has) return { ...prev, concerns: prev.concerns.filter((c) => c !== label) };
      if (prev.concerns.length >= 3) return prev;
      return { ...prev, concerns: [...prev.concerns, label] };
    });
  };

  if (!step) return null;

  const questionTitle =
    step.type === "multi"
      ? "What would you like to improve?"
      : step.label;

  const questionHint =
    step.type === "multi"
      ? "Select up to 3 concerns that matter most to you right now."
      : null;

  const shellClass =
    variant === "modal"
      ? "flex flex-col max-h-[min(85vh,640px)] min-h-0"
      : "py-8 px-6 max-w-lg mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={shellClass}
    >
      <div
        className={cn(
          "shrink-0 bg-background z-10 border-b border-border",
          variant === "modal" ? "px-5 pt-5 pb-4" : "mb-2"
        )}
      >
        <p className="text-xs tracking-[0.25em] uppercase text-accent mb-2">
          Step {stepIndex + 1} of {SKIN_QUESTION_STEPS.length}
        </p>
        <h2 className="font-serif text-xl sm:text-2xl font-semibold leading-snug">{questionTitle}</h2>
        {questionHint && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{questionHint}</p>
        )}
        {step.type === "multi" && answers.concerns.length > 0 && (
          <p className="text-xs text-accent mt-2">{answers.concerns.length} of 3 selected</p>
        )}
      </div>

      <div
        className={cn(
          "flex-1 min-h-0 overflow-y-auto overscroll-contain",
          variant === "modal" ? "px-5 py-4" : "mt-4"
        )}
      >
        {step.type === "single" && (
          <div className="space-y-2">
            {step.options.map((opt) => {
              const key = step.id as keyof SkinQuestionnaireAnswers;
              const selected = answers[key] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [key]: opt }))}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-sm border text-sm transition-colors",
                    selected
                      ? "border-accent bg-accent/5 text-accent-dark font-medium"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {step.type === "multi" && (
          <div className="space-y-2">
            {step.options.map((opt) => {
              const selected = answers.concerns.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleConcern(opt)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-sm border text-sm transition-colors",
                    selected
                      ? "border-accent bg-accent/5 text-accent-dark font-medium"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {step.type === "boolean" && (
          <div className="flex gap-3">
            {(["Yes", "No"] as const).map((label) => {
              const val = label === "Yes";
              const key = step.id as "sensitiveSkin" | "usesSpfDaily";
              const selected = answers[key] === val;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [key]: val }))}
                  className={cn(
                    "flex-1 py-3 rounded-sm border text-sm font-medium transition-colors",
                    selected
                      ? "border-accent bg-accent text-white"
                      : "border-border hover:border-accent/40"
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        className={cn(
          "shrink-0 flex gap-3 bg-background border-t border-border",
          variant === "modal" ? "px-5 py-4" : "mt-8"
        )}
      >
        <button
          type="button"
          onClick={stepIndex === 0 ? onBack : () => setStepIndex((i) => i - 1)}
          className="px-6 py-3 border border-border rounded-full text-sm"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!canContinue()}
          onClick={next}
          className="flex-1 py-3 bg-accent text-white rounded-full text-sm tracking-wide uppercase font-medium disabled:opacity-40"
        >
          {isLast ? "Continue to camera" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}
