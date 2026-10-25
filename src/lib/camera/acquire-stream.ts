export type CameraErrorCode =
  | "unsupported"
  | "denied"
  | "not-found"
  | "failed";

export class CameraError extends Error {
  constructor(
    message: string,
    readonly code: CameraErrorCode
  ) {
    super(message);
    this.name = "CameraError";
  }
}

/** Tries front camera first, then any camera — works across iOS Safari and Android Chrome. */
export async function acquireUserCameraStream(): Promise<MediaStream> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    throw new CameraError(
      "Camera is not supported in this browser. Try uploading a photo instead.",
      "unsupported"
    );
  }

  const constraints: MediaStreamConstraints[] = [
    { video: { facingMode: { ideal: "user" }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false },
    { video: { facingMode: "user" }, audio: false },
    { video: { facingMode: { ideal: "environment" } }, audio: false },
    { video: true, audio: false },
  ];

  let lastErr: unknown;
  for (const c of constraints) {
    try {
      return await navigator.mediaDevices.getUserMedia(c);
    } catch (e) {
      lastErr = e;
    }
  }

  const name = lastErr instanceof DOMException ? lastErr.name : "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    throw new CameraError(
      "Camera access was blocked. Allow camera for this site in your browser settings, or upload a photo instead.",
      "denied"
    );
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    throw new CameraError("No camera found on this device. Upload a photo instead.", "not-found");
  }
  throw new CameraError(
    "Could not start the camera. Try again or upload a photo from your gallery.",
    "failed"
  );
}

export function compressDataUrl(dataUrl: string, maxWidth = 1024, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => reject(new Error("image load"));
    img.src = dataUrl;
  });
}
