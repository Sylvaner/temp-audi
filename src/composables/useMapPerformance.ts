/**
 * Composable pour l'optimisation des performances de la carte Leaflet
 * Gère le debouncing, throttling et lazy loading des marqueurs
 */

import { ref, type Ref } from 'vue'

export interface MapPerformanceOptions {
  debounceDelay?: number
  throttleDelay?: number
  maxMarkersPerBatch?: number
}

export interface MapPerformanceManager {
  debouncedUpdate: (fn: () => void) => void
  throttledUpdate: (fn: () => void) => void
  batchProcessMarkers: <T>(items: T[], processor: (item: T) => void) => Promise<void>
  isProcessing: Ref<boolean>
}

/**
 * Utilitaire de debouncing pour éviter les updates trop fréquents
 */
function createDebouncer(delay: number) {
  let timeoutId: number | null = null

  return (fn: () => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = window.setTimeout(fn, delay)
  }
}

/**
 * Utilitaire de throttling pour limiter la fréquence d'exécution
 */
function createThrottler(delay: number) {
  let lastExecution = 0
  let timeoutId: number | null = null

  return (fn: () => void) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecution

    if (timeSinceLastExecution >= delay) {
      lastExecution = now
      fn()
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastExecution = Date.now()
        timeoutId = null
        fn()
      }, delay - timeSinceLastExecution)
    }
  }
}

/**
 * Crée un gestionnaire de performance pour la carte
 */
export function useMapPerformance(options: MapPerformanceOptions = {}): MapPerformanceManager {
  const { debounceDelay = 300, throttleDelay = 100, maxMarkersPerBatch = 10 } = options

  const isProcessing = ref(false)
  const debouncedUpdate = createDebouncer(debounceDelay)
  const throttledUpdate = createThrottler(throttleDelay)

  /**
   * Traite les marqueurs par lots pour éviter de bloquer l'UI
   */
  const batchProcessMarkers = async <T>(
    items: T[],
    processor: (item: T) => void,
  ): Promise<void> => {
    if (isProcessing.value) return

    isProcessing.value = true

    try {
      for (let i = 0; i < items.length; i += maxMarkersPerBatch) {
        const batch = items.slice(i, i + maxMarkersPerBatch)

        // Traiter le lot
        batch.forEach(processor)

        // Yielder le contrôle au navigateur entre les lots
        if (i + maxMarkersPerBatch < items.length) {
          await new Promise((resolve) => requestAnimationFrame(() => resolve(void 0)))
        }
      }
    } finally {
      isProcessing.value = false
    }
  }

  return {
    debouncedUpdate,
    throttledUpdate,
    batchProcessMarkers,
    isProcessing,
  }
}
