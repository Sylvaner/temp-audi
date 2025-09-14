/**
 * Composable pour améliorer l'accessibilité de la navigation
 * Gère le focus, les annonces et la navigation clavier
 */

import { ref, nextTick, onMounted, onUnmounted, type Ref } from 'vue'

export interface NavigationAccessibilityOptions {
  skipLinks?: Array<{ id: string; label: string }>
  landmarkLabels?: Record<string, string>
}

export interface NavigationAccessibilityState {
  // Gestion du focus
  currentFocusId: Ref<string | null>
  focusElement: (id: string) => void
  focusMain: () => void

  // Skip links
  skipToContent: () => void
  skipToNavigation: () => void

  // Annonces pour lecteurs d'écran
  announceRouteChange: (routeName: string) => void
  liveRegionMessage: Ref<string>

  // Navigation clavier
  onGlobalKeydown: (event: KeyboardEvent) => void

  // Gestion des landmarks
  setLandmarkLabel: (landmark: string, label: string) => void
}

/**
 * Composable pour l'accessibilité de la navigation
 */
export function useNavigationAccessibility(
  options: NavigationAccessibilityOptions = {},
): NavigationAccessibilityState {
  const { skipLinks = [], landmarkLabels = {} } = options

  const currentFocusId = ref<string | null>(null)
  const liveRegionMessage = ref<string>('')

  // Gestion du focus
  const focusElement = async (id: string) => {
    await nextTick()
    const element = document.getElementById(id)
    if (element) {
      element.focus()
      currentFocusId.value = id
    }
  }

  const focusMain = () => {
    focusElement('main-content')
  }

  // Skip links
  const skipToContent = () => {
    focusElement('main-content')
    announceMessage('Contenu principal')
  }

  const skipToNavigation = () => {
    focusElement('main-navigation')
    announceMessage('Navigation principale')
  }

  // Annonces pour lecteurs d'écran
  const announceMessage = (message: string) => {
    liveRegionMessage.value = message
    // Clear après un délai pour permettre aux lecteurs d'écran de lire
    setTimeout(() => {
      liveRegionMessage.value = ''
    }, 1000)
  }

  const announceRouteChange = (routeName: string) => {
    const routeLabels: Record<string, string> = {
      home: "Page d'accueil",
      map: 'Carte interactive',
      about: 'À propos',
      'map-intro': 'Introduction à la carte',
    }

    const label = routeLabels[routeName] || routeName
    announceMessage(`Navigation vers ${label}`)
  }

  // Navigation clavier globale
  const onGlobalKeydown = (event: KeyboardEvent) => {
    // Alt + 1 = Aller au contenu principal
    if (event.altKey && event.key === '1') {
      event.preventDefault()
      skipToContent()
      return
    }

    // Alt + 2 = Aller à la navigation
    if (event.altKey && event.key === '2') {
      event.preventDefault()
      skipToNavigation()
      return
    }

    // Échap = Fermer les menus ouverts
    if (event.key === 'Escape') {
      const activeDropdown = document.querySelector('.dropdown.is-active')
      if (activeDropdown) {
        activeDropdown.classList.remove('is-active')
        // Focus sur le bouton qui a ouvert le dropdown
        const trigger = activeDropdown.querySelector('button')
        trigger?.focus()
      }
    }

    // F6 = Navigation entre les landmarks
    if (event.key === 'F6') {
      event.preventDefault()
      navigateLandmarks()
    }
  }

  // Navigation entre les landmarks avec F6
  let currentLandmarkIndex = 0
  const navigateLandmarks = () => {
    const landmarks = ['main-navigation', 'main-content', 'complementary-content', 'footer-content']

    const availableLandmarks = landmarks.filter((id) => document.getElementById(id))

    if (availableLandmarks.length === 0) return

    currentLandmarkIndex = (currentLandmarkIndex + 1) % availableLandmarks.length
    const landmarkId = availableLandmarks[currentLandmarkIndex]

    focusElement(landmarkId)

    // Annoncer le landmark
    const landmarkLabel = landmarkLabels[landmarkId] || landmarkId
    announceMessage(`Zone de navigation: ${landmarkLabel}`)
  }

  // Configuration des landmarks
  const setLandmarkLabel = (landmark: string, label: string) => {
    landmarkLabels[landmark] = label
  }

  // Setup des skip links
  const setupSkipLinks = () => {
    const skipLinksContainer = document.getElementById('skip-links')
    if (!skipLinksContainer || skipLinks.length === 0) return

    skipLinksContainer.innerHTML = skipLinks
      .map(
        (link) => `
      <a href="#${link.id}" class="skip-link" onclick="document.getElementById('${link.id}').focus(); return false;">
        ${link.label}
      </a>
    `,
      )
      .join('')
  }

  // Gestionnaire d'événements globaux
  const setupGlobalListeners = () => {
    document.addEventListener('keydown', onGlobalKeydown)
    return () => {
      document.removeEventListener('keydown', onGlobalKeydown)
    }
  }

  onMounted(() => {
    setupSkipLinks()
    const cleanup = setupGlobalListeners()

    onUnmounted(() => {
      cleanup()
    })
  })

  return {
    // Gestion du focus
    currentFocusId,
    focusElement,
    focusMain,

    // Skip links
    skipToContent,
    skipToNavigation,

    // Annonces
    announceRouteChange,
    liveRegionMessage,

    // Navigation clavier
    onGlobalKeydown,

    // Landmarks
    setLandmarkLabel,
  }
}
