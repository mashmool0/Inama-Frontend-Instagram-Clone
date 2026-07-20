export interface Particle {
  top: number
  left: number
  duration: number
  delay: number
}

export function createParticles(count: number, seed: number, baseDuration: number, durationRange: number, delayRange: number) {
  let state = seed >>> 0
  const next = () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }

  return Array.from({ length: count }, (): Particle => ({
    top: next() * 100,
    left: next() * 100,
    duration: baseDuration + next() * durationRange,
    delay: next() * delayRange,
  }))
}
