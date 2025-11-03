/**
 * Configuration Font Awesome
 * Centralise l'enregistrement des icônes et l'export du composant
 */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMap,
  faInfoCircle,
  faFlag,
  faPlay,
  faPause,
  faStop,
  faVolumeUp,
  faHeadphones,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faAngleDown,
  faMapMarkerAlt,
  faExclamationTriangle,
  faCheck,
  faRedo,
  faLocationCrosshairs,
  faLocationArrow,
  faSpinner,
  faList,
  faTimes,
  faCircleNotch,
  // Icônes pour les marqueurs
  faBuilding,
  faSeedling,
  faBasketShopping,
  faMonument,
  faPersonWalking,
} from '@fortawesome/free-solid-svg-icons'

// Ajouter toutes les icônes à la bibliothèque
library.add(
  faMap,
  faInfoCircle,
  faFlag,
  faPlay,
  faPause,
  faStop,
  faVolumeUp,
  faHeadphones,
  faChevronLeft,
  faChevronRight,
  faGlobe,
  faAngleDown,
  faMapMarkerAlt,
  faExclamationTriangle,
  faCheck,
  faRedo,
  faLocationCrosshairs,
  faLocationArrow,
  faSpinner,
  faList,
  faTimes,
  faCircleNotch,
  faBuilding,
  faSeedling,
  faBasketShopping,
  faMonument,
  faPersonWalking,
)

// Export du composant
export { FontAwesomeIcon }

// Export de la bibliothèque pour usage avancé si nécessaire
export { library }
