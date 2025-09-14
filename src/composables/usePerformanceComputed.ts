/**
 * Composable pour les computed properties memoizés et optimisés
 * Évite les recalculs inutiles et améliore les performances
 */

import { computed, shallowRef, type ComputedRef, type Ref } from 'vue'

/**
 * Cache simple pour les computed properties coûteux
 */
class ComputedCache {
  private cache = new Map<string, { value: unknown; deps: unknown[] }>()

  get<T>(key: string, deps: unknown[], compute: () => T): T {
    const cached = this.cache.get(key)

    // Vérifier si les dépendances ont changé (shallow comparison)
    if (cached && this.depsEqual(cached.deps, deps)) {
      return cached.value as T
    }

    // Recalculer si nécessaire
    const value = compute()
    this.cache.set(key, { value, deps: [...deps] })
    return value
  }

  private depsEqual(a: unknown[], b: unknown[]): boolean {
    if (a.length !== b.length) return false
    return a.every((val, index) => val === b[index])
  }

  clear(): void {
    this.cache.clear()
  }
}

const globalCache = new ComputedCache()

/**
 * Computed memoizé pour éviter les recalculs coûteux
 */
export function useMemoizedComputed<T>(
  key: string,
  compute: () => T,
  deps: Ref<unknown>[],
): ComputedRef<T> {
  return computed(() => {
    const depValues = deps.map((ref) => ref.value)
    return globalCache.get(key, depValues, compute)
  })
}

/**
 * Computed shallow pour objets/arrays peu profonds
 * Évite les recalculs si la référence de l'objet n'a pas changé
 */
export function useShallowComputed<T extends object>(compute: () => T): ComputedRef<T> {
  const cache = shallowRef<T | null>(null)

  return computed(() => {
    const newValue = compute()

    // Utiliser shallowRef pour éviter la réactivité profonde
    if (!cache.value || cache.value !== newValue) {
      cache.value = newValue
    }

    return cache.value
  })
}

/**
 * Computed pour formatage de texte avec cache
 */
export function useCachedTextComputed(
  text: Ref<string>,
  formatter: (text: string) => string[],
): ComputedRef<string[]> {
  return useMemoizedComputed(`text-format-${text.value}`, () => formatter(text.value), [text])
}

/**
 * Computed pour classe CSS conditionnelle optimisée
 */
export function useCssClassComputed(conditions: Record<string, Ref<boolean>>): ComputedRef<string> {
  const conditionRefs = Object.values(conditions)
  const conditionKeys = Object.keys(conditions)

  return useMemoizedComputed(
    `css-classes-${conditionKeys.join('-')}`,
    () => {
      return conditionKeys.filter((key, index) => conditionRefs[index].value).join(' ')
    },
    conditionRefs,
  )
}

/**
 * Nettoyage du cache global (à utiliser avec parcimonie)
 */
export function clearComputedCache(): void {
  globalCache.clear()
}
