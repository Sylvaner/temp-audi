/**
 * Composable pour les calculs géographiques et logique de centrage
 * Sépare les calculs géométriques de la logique de store
 */

import { computed, type Ref } from 'vue'

export interface GeolocationCalculatorOptions {
  userPosition: Ref<{ latitude: number; longitude: number } | null>
  mapCenter: { latitude: number; longitude: number }
  threshold: number
  increaseZoom: number
  baseZoom: number
}

export interface GeolocationCalculator {
  distanceToCenter: Ref<number>
  isUserInArea: Ref<boolean>
  shouldCenterOnUser: Ref<boolean>
  increasedZoom: Ref<number>
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number
}

/**
 * Crée un calculateur géographique pour la géolocalisation
 */
export function useGeolocationCalculator(
  options: GeolocationCalculatorOptions,
): GeolocationCalculator {
  const { userPosition, mapCenter, threshold, increaseZoom, baseZoom } = options

  /**
   * Calcule la distance entre deux points géographiques (en degrés)
   */
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const deltaLat = Math.abs(lat1 - lat2)
    const deltaLon = Math.abs(lon1 - lon2)
    return Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon)
  }

  /**
   * Distance actuelle de l'utilisateur au centre de la carte
   */
  const distanceToCenter = computed(() => {
    if (!userPosition.value) return Infinity

    return calculateDistance(
      userPosition.value.latitude,
      userPosition.value.longitude,
      mapCenter.latitude,
      mapCenter.longitude,
    )
  })

  /**
   * Vérifie si l'utilisateur est dans la zone du centre de la carte
   */
  const isUserInArea = computed(() => {
    if (!userPosition.value) return false

    const distance = distanceToCenter.value
    console.log('Distance to initial center:', distance)
    console.log('Threshold:', threshold)
    console.log('Is user in initial area:', distance <= threshold)

    return distance <= threshold
  })

  /**
   * Détermine si on doit centrer automatiquement sur l'utilisateur
   */
  const shouldCenterOnUser = computed(() => {
    return isUserInArea.value
  })

  /**
   * Zoom augmenté pour le centrage sur l'utilisateur
   */
  const increasedZoom = computed(() => {
    return baseZoom + increaseZoom
  })

  return {
    distanceToCenter,
    isUserInArea,
    shouldCenterOnUser,
    increasedZoom,
    calculateDistance,
  }
}
