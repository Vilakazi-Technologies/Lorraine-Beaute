"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, Sparkles, RotateCcw, ShoppingBag, ScanFace } from "lucide-react";
import { getRecommendedProducts, type SkinAnalysisResult } from "@/lib/claude-commerce";
import { formatPrice } from "@/lib/utils";
import { ProductCard } from "./product-card";

type Step = "intro" | "camera" | "analyzing" | "results";

interface SkinAnalysisProps {
  variant?: "page" | "modal";
  onClose?: () => void;
}

export function SkinAnalysis({ variant = "page", onClose }: SkinAnalysisProps) {
  const [step, setStep] = useState<Step>("intro");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [result, setResult] = useState<SkinAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      setStep("camera");
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch {
      setError("Camera access is required for skin analysis. Please allow camera permissions and try again.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
    analyzeSkin(dataUrl);
  }, [stopCamera]);

  const analyzeSkin = async (imageData: string) => {
    setStep("analyzing");
    setError(null);

    try {
      const res = await fetch("/api/skin-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep("results");
    } catch {
      setError("Analysis failed. Please try again.");
      setStep("camera");
      startCamera();
    }
  };

  const reset = () => {
    stopCamera();
    setCapturedImage(null);
    setResult(null);
    setError(null);
    setStep("intro");
  };

  const recommendedProducts = result
    ? getRecommendedProducts(result.recommendedProductIds)
    : [];

  const containerClass =
    variant === "modal"
      ? "fixed inset-0 z-[80] flex items-center justify-center p-4"
      : "min-h-screen py-12 sm:py-20";

  return (
    <div className={containerClass}>
      {variant === "modal" && (
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      )}

      <div
        className={`relative bg-background ${
          variant === "modal"
            ? "w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-border"
            : "max-w-4xl mx-auto px-4 sm:px-6"
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
                Scan your face for a personalised digital skin assessment. Our Claude-powered AI
                analyses your skin and recommends the perfect Lorraine Beauté products for you.
              </p>
              {error && (
                <p className="text-sm text-accent mb-4">{error}</p>
              )}
              <button
                onClick={startCamera}
                className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium hover:bg-accent-dark transition-colors"
              >
                <Camera className="w-4 h-4" />
                Start Skin Scan
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Your photo is analysed securely and never stored
              </p>
            </motion.div>
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
              <div className="relative aspect-[4/3] max-w-lg mx-auto rounded-sm overflow-hidden bg-black mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: "scaleX(-1)" }}
                />
                <div className="absolute inset-0 border-2 border-white/30 rounded-[50%] m-8 pointer-events-none" />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-center gap-4">
                <button
                  onClick={reset}
                  className="px-6 py-3 border border-border rounded-full text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full text-sm tracking-wide uppercase font-medium"
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
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-6"
              />
              <Sparkles className="w-6 h-6 text-gold mx-auto mb-4" />
              <h2 className="font-serif text-2xl mb-2">Analysing Your Skin</h2>
              <p className="text-muted-foreground text-sm">
                Claude AI is assessing your skin profile...
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
                    Your Results
                  </p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold mb-2">
                    {result.skinType.charAt(0).toUpperCase() + result.skinType.slice(1)} Skin
                  </h2>
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

              <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-6">
                Recommended For You
              </h3>
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
                {recommendedProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={reset}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Scan Again
                </button>
                {variant === "modal" && onClose ? (
                  <button
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

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-accent-dark text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:bg-accent transition-colors"
        aria-label="Open AI Skin Analysis"
      >
        <ScanFace className="w-5 h-5" />
        <span className="text-xs tracking-[0.12em] uppercase font-medium hidden sm:inline">
          Skin Analysis
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <SkinAnalysis variant="modal" onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
