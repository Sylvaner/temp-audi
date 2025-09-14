/**
 * Composable pour le lazy loading des images
 * Améliore les performances en chargeant les images seulement quand nécessaire
 */

import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface LazyImageOptions {
  rootMargin?: string
  threshold?: number
  placeholder?: string
  errorImage?: string
}

export interface LazyImageState {
  imageSrc: Ref<string>
  isLoaded: Ref<boolean>
  hasError: Ref<boolean>
  isInView: Ref<boolean>
  observeElement: (element: HTMLElement) => void
  unobserveElement: () => void
}

/**
 * Composable pour le lazy loading d'images
 */
export function useLazyImage(src: string, options: LazyImageOptions = {}): LazyImageState {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4K',
    errorImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZmVmZWYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiPkVycmV1cjwvdGV4dD48L3N2Zz4K',
  } = options

  const imageSrc = ref<string>(placeholder)
  const isLoaded = ref<boolean>(false)
  const hasError = ref<boolean>(false)
  const isInView = ref<boolean>(false)
  const elementRef = ref<HTMLElement | null>(null)

  let observer: IntersectionObserver | null = null

  const loadImage = async (): Promise<void> => {
    try {
      const img = new Image()

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Erreur de chargement image'))
        img.src = src
      })

      imageSrc.value = src
      isLoaded.value = true
      hasError.value = false
    } catch {
      imageSrc.value = errorImage
      isLoaded.value = false
      hasError.value = true
    }
  }

  const setupObserver = (): void => {
    if (!('IntersectionObserver' in window)) {
      // Fallback pour navigateurs non supportés
      loadImage()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInView.value = true
            loadImage()
            observer?.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin,
        threshold,
      },
    )
  }

  const observeElement = (element: HTMLElement): void => {
    elementRef.value = element
    if (observer && element) {
      observer.observe(element)
    }
  }

  const unobserveElement = (): void => {
    if (observer && elementRef.value) {
      observer.unobserve(elementRef.value)
    }
  }

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return {
    imageSrc,
    isLoaded,
    hasError,
    isInView,
    observeElement,
    unobserveElement,
  }
}

/**
 * Directive Vue pour le lazy loading simple
 */
export const vLazyImage = {
  mounted(el: HTMLImageElement, binding: { value: string }) {
    const { imageSrc, observeElement } = useLazyImage(binding.value)

    // Observer l'élément
    observeElement(el)

    // Watcher pour mettre à jour l'src
    const unwatchSrc = () => {
      el.src = imageSrc.value
    }

    // Setup initial
    unwatchSrc()
  },
}
