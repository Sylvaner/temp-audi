/**
 * Composable pour l'optimisation des watchers et debouncing
 * Améliore les performances en évitant les updates trop fréquents
 */

import { ref, watch, type Ref, type WatchSource, type WatchCallback } from 'vue'

/**
 * Watcher avec debounce pour éviter les updates trop fréquents
 */
export function useDebouncedWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  delay = 300
): void {
  let timeoutId: number | null = null

  watch(source, (newValue, oldValue, onCleanup) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = window.setTimeout(() => {
      callback(newValue, oldValue, onCleanup)
    }, delay)

    onCleanup(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })
  })
}

/**
 * Watcher avec throttle pour limiter la fréquence d'exécution
 */
export function useThrottledWatch<T>(
  source: WatchSource<T>,
  callback: WatchCallback<T>,
  delay = 100
): void {
  let lastExecution = 0
  let timeoutId: number | null = null

  watch(source, (newValue, oldValue, onCleanup) => {
    const now = Date.now()
    const timeSinceLastExecution = now - lastExecution

    if (timeSinceLastExecution >= delay) {
      lastExecution = now
      callback(newValue, oldValue, onCleanup)
    } else if (!timeoutId) {
      timeoutId = window.setTimeout(() => {
        lastExecution = Date.now()
        timeoutId = null
        callback(newValue, oldValue, onCleanup)
      }, delay - timeSinceLastExecution)
    }

    onCleanup(() => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    })
  })
}

/**
 * Ref optimisé pour éviter les updates inutiles
 * Met à jour seulement si la valeur a vraiment changé
 */
export function useOptimizedRef<T>(initialValue: T): Ref<T> {
  const internalRef = ref<T>(initialValue)

  return new Proxy(internalRef, {
    set(target, property, value) {
      if (property === 'value' && target.value !== value) {
        return Reflect.set(target, property, value)
      } else if (property !== 'value') {
        return Reflect.set(target, property, value)
      }
      return true
    }
  }) as Ref<T>
}

/**
 * Utilitaire pour batching des updates DOM
 */
export function useBatchedUpdates() {
  const pendingUpdates = ref<(() => void)[]>([])
  const isScheduled = ref(false)

  const flushUpdates = () => {
    const updates = pendingUpdates.value.splice(0)
    updates.forEach(update => update())
    isScheduled.value = false
  }

  const batchUpdate = (update: () => void) => {
    pendingUpdates.value.push(update)
    
    if (!isScheduled.value) {
      isScheduled.value = true
      requestAnimationFrame(flushUpdates)
    }
  }

  return {
    batchUpdate,
    pendingCount: () => pendingUpdates.value.length
  }
}
