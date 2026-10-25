"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Sparkles, RotateCcw, ShoppingBag, ScanFace, Upload } from "lucide-react";
import { acquireUserCameraStream, CameraError, compressDataUrl } from "@/lib/camera/acquire-stream";
import {
  getRecommendedProducts,
  type SkinAnalysisResult,
} from "@/lib/vilatech-ai/commerce";
import type { SkinQuestionnaireAnswers } from "@/lib/skin-questionnaire";
import { emptyQuestionnaire } from "@/lib/skin-questionnaire";
import { useCatalog } from "@/lib/catalog-context";
import { VILATECH_AI } from "@/lib/brand";
import { useBodyScrollLock } from "@/lib/hooks/use-body-scroll-lock";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { ProductCard } from "./product-card";
import { SkinQuestionnaireForm } from "./skin-questionnaire-form";

type Step = "intro" | "questionnaire" | "camera" | "analyzing" | "results";

const ANALYSIS_PHASES = [
  "Reading your questionnaire…",
  "Mapping facial zones…",
  "Assessing hydration and skin barrier…",
  "Examining pores and texture…",
  "Reviewing tone and pigmentation…",
  "Cross-checking with your age and skin type…",
  "Matching K-beauty from our catalog…",
  "Preparing your personalised consultation notes…",
] as const;

interface SkinAnalysisProps {
  variant?: "page" | "modal";
  onClose?: () => void;
}

function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  if (video.videoWidth > 0 && video.videoHeight > 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Camera preview timed out")), 8000);
    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      resolve();
    };
  });
}

export function SkinAnalysis({ variant = "page", onClose }: SkinAnalysisProps) {
  const { products: catalog } = useCatalog();
  const [step, setStep] = useState<Step>("intro");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [questionnaire, setQuestionnaire] = useState<SkinQuestionnaireAnswers>(
    emptyQuestionnaire()
  );
  const [error, setError] = useState<string | null>(null);
  const [analysisPhaseIndex, setAnalysisPhaseIndex] = useState(0);
  const [cameraStarting, setCameraStarting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useBodyScrollLock(variant === "modal" && step !== "camera");

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStream(null);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    if (step !== "camera") {
      stopCamera();
      return;
    }

    let cancelled = false;
    setCameraStarting(true);
    setError(null);

    void (async () => {
      try {
        stopCamera();
        const mediaStream = await acquireUserCameraStream();
        if (cancelled) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = mediaStream;
        setStream(mediaStream);
      } catch (err) {
        if (!cancelled) {
          const msg =
            err instanceof CameraError
              ? err.message
              : "Could not open the camera. Upload a photo from your gallery instead.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setCameraStarting(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [step, stopCamera]);

  useLayoutEffect(() => {
    if (step !== "camera" || !stream || !videoRef.current) return;
    const video = videoRef.current;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    void video.play().catch(() => {
      setError("Tap the screen once if the preview stays black, or upload a photo instead.");
    });
  }, [step, stream]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (step !== "analyzing") {
      setAnalysisPhaseIndex(0);
      return;
    }
    const timer = window.setInterval(() => {
      setAnalysisPhaseIndex((i) => (i + 1) % ANALYSIS_PHASES.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [step]);

  const analyzeSkin = useCallback(async (imageData: string) => {
    setStep("analyzing");
    setAnalysisPhaseIndex(0);
    setError(null);
    stopCamera();

    let payload = imageData;
    try {
      payload = await compressDataUrl(imageData);
    } catch {
      payload = imageData;
    }

    try {
      const res = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: payload, questionnaire }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error ?? "Analysis failed");
      }
      setResult(data);
      setStep("results");
    } catch {
      setError("Analysis could not complete. Your photo was captured — please try again.");
      setStep("camera");
    }
  }, [questionnaire, stopCamera]);

  const capturePhoto = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    try {
      await waitForVideoReady(video);
    } catch {
      setError("Camera is still loading. Wait a moment, then capture again.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    await analyzeSkin(dataUrl);
  }, [analyzeSkin, stopCamera]);

  const handleGalleryPhoto = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please choose a photo (JPEG or PNG).");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setCapturedImage(dataUrl);
        void analyzeSkin(dataUrl);
      };
      reader.onerror = () => setError("Could not read that photo. Try another.");
      reader.readAsDataURL(file);
    },
    [analyzeSkin]
  );

  const reset = () => {
    stopCamera();
    setCapturedImage(null);
    setResult(null);
    setQuestionnaire(emptyQuestionnaire());
    setError(null);
    setStep("intro");
  };

  const recommendedProducts = result
    ? getRecommendedProducts(result.recommendedProductIds, catalog)
    : [];

  const containerClass =
    variant === "modal"
      ? "fixed inset-0 z-[260] flex items-end sm:items-center justify-center p-0 sm:p-4 touch-none"
      : "min-h-screen py-12 sm:py-20";

  return (
    <div className={containerClass} role="dialog" aria-modal={variant === "modal"}>
      {variant === "modal" && (
        <button
          type="button"
          className="fixed inset-0 bg-black/55 touch-none"
          onClick={onClose}
          aria-label="Close skin analysis"
        />
      )}

      <div
        className={`relative bg-background ${
          variant === "modal"
            ? "w-full sm:max-w-2xl max-h-[min(92vh,720px)] flex flex-col min-h-0 rounded-t-sm sm:rounded-sm shadow-2xl border border-border z-[261]"
            : "max-w-4xl mx-auto px-4 sm:px-6 w-full"
        }`}
      >
        {variant === "modal" && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-muted rounded-full"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="text-center py-12 px-6"
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ScanFace className="w-8 h-8 text-accent" />
              </div>
              <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
                Our Unique Feature
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold mb-4">
                AI Skin Analysis
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                Answer a short questionnaire, then scan your face. {VILATECH_AI} combines both for
                a consultation-style assessment and recommendations from our live K-beauty catalog.
              </p>
              {error && (
                <p className="text-sm text-accent mb-4 max-w-md mx-auto">{error}</p>
              )}
              {capturedImage && error && (
                <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-border">
                  <Image src={capturedImage} alt="Last capture" fill className="object-cover" unoptimized />
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("questionnaire");
                }}
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors"
              >
                <Camera className="w-4 h-4" />
                {capturedImage && error ? "Retry questionnaire & scan" : "Start — questionnaire first"}
              </button>
              <p className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto leading-relaxed">
                Cosmetic guidance only — not medical diagnosis. Your photo is processed securely for
                this session and not stored on our servers. You can use your camera or upload a
                photo; stop anytime with Close or Cancel.
              </p>
            </motion.div>
          )}

          {step === "questionnaire" && (
            <SkinQuestionnaireForm
              variant={variant}
              onComplete={(answers) => {
                setQuestionnaire(answers);
                setStep("camera");
              }}
              onBack={() => setStep("intro")}
            />
          )}

          {step === "camera" && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              <h2 className="font-serif text-2xl text-center mb-4">Position Your Face</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Centre your face in the frame with good lighting
              </p>
              <div className="relative aspect-[4/3] max-w-lg mx-auto rounded-sm overflow-hidden bg-black mb-4">
                {cameraStarting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 text-sm z-10 bg-black/70">
                    <div className="w-10 h-10 border-2 border-white/40 border-t-white rounded-full animate-spin mb-3" />
                    Starting camera…
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 border-2 border-white/30 rounded-[50%] m-8 pointer-events-none" />
              </div>
              {error && (
                <p className="text-sm text-accent text-center mb-4 max-w-md mx-auto">{error}</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleGalleryPhoto(file);
                  e.target.value = "";
                }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-full text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Upload face photo
                </button>
              </div>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3 border border-border rounded-full text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={cameraStarting || !stream}
                  onClick={() => void capturePhoto()}
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase font-medium disabled:opacity-40"
                >
                  <Camera className="w-4 h-4" />
                  Capture & Analyse
                </button>
              </div>
            </motion.div>
          )}

          {step === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 px-6"
            >
              <motion.div
                animate={reducedMotion ? {} : { rotate: 360 }}
                transition={
                  reducedMotion
                    ? { duration: 0 }
                    : { duration: 2, repeat: Infinity, ease: "linear" }
                }
                className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-6"
                aria-hidden
              />
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-2">Your skin consultant is reviewing</h2>
              <motion.p
                key={analysisPhaseIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-muted-foreground text-sm max-w-sm mx-auto min-h-[2.5rem]"
              >
                {ANALYSIS_PHASES[analysisPhaseIndex]}
              </motion.p>
              <p className="text-xs text-muted-foreground/80 mt-3">
                Powered by {VILATECH_AI} — stay on this screen; your analysis usually takes under a
                minute.
              </p>
              {capturedImage && (
                <div className="relative w-24 h-24 mx-auto mt-6 rounded-full overflow-hidden border-2 border-accent/30">
                  <Image src={capturedImage} alt="Captured" fill className="object-cover" unoptimized />
                </div>
              )}
            </motion.div>
          )}

          {step === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8"
            >
              <div className="flex items-start gap-6 mb-8">
                {capturedImage && (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-accent/30">
                    <Image src={capturedImage} alt="Your scan" fill className="object-cover" unoptimized />
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-accent mb-1">
                    Consultation summary
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2">
                    {result.skinType.charAt(0).toUpperCase() + result.skinType.slice(1)} skin profile
                  </h2>
                  <p className="text-xs text-muted-foreground mb-2">
                    What your {VILATECH_AI} consultant sees and recommends for you:
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{result.summary}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-muted/50 border border-border rounded-sm p-5">
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium mb-3">
                    Detected Concerns
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.concerns.map((c) => (
                      <span
                        key={c}
                        className="text-xs bg-rose/60 text-accent-dark px-3 py-1.5 rounded-full capitalize"
                      >
                        {c.replace(/-/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-muted/50 border border-border rounded-sm p-5">
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium mb-3">
                    Expert Tips
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-accent shrink-0">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-2">
                Recommended from our catalog
              </h3>
              {recommendedProducts.length > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  Based on your scan, your consultant selected:{" "}
                  {recommendedProducts.map((p) => p.name).join(" · ")}
                </p>
              )}
              {!recommendedProducts.length && <div className="mb-6" />}
              {recommendedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
                  {recommendedProducts.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mb-8">
                  Browse the shop for products matched to your routine.
                </p>
              )}

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Again
                </button>
                {variant === "modal" && onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Continue Shopping
                  </button>
                ) : (
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase font-medium"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop All Products
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function SkinAnalysisFab() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("lorraine:open-skin-analysis", onOpen);
    return () => window.removeEventListener("lorraine:open-skin-analysis", onOpen);
  }, []);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[230] flex items-center gap-2 bg-accent-dark text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-accent transition-colors"
        aria-label="Open AI Skin Analysis"
      >
        <ScanFace className="w-5 h-5" />
        <span className="text-xs tracking-[0.12em] uppercase font-medium hidden sm:inline">
          Skin Analysis
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SkinAnalysis variant="modal" onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
