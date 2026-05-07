// TypeScript definitions for Google Analytics gtag.js

export interface GtagCommands {
  config: (targetId: string, config?: Record<string, unknown>) => void
  event: (eventName: string, eventParams?: Record<string, unknown>) => void
  set: (config: Record<string, unknown>) => void
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

export {}
