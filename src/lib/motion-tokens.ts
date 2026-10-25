/** Shared motion — motion-design + prefers-reduced-motion. */
export const motionTokens = {
  duration: {
    instant: 0,
    fast: 0.2,
    base: 0.55,
    slow: 0.85,
  },
  distance: {
    sm: 12,
    md: 24,
    lg: 40,
  },
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
} as const;

export function revealTransition(reducedMotion: boolean, delay = 0) {
  if (reducedMotion) {
    return { duration: motionTokens.duration.instant, delay: 0 };
  }
  return {
    duration: motionTokens.duration.base,
    ease: motionTokens.ease,
    delay,
  };
}
