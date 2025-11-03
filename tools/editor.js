import { createApp } from 'vue'
import PlaceEditor from './Editor.vue'
import 'leaflet/dist/leaflet.css'
import 'bulma/css/bulma.min.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faMapMarkedAlt,
  faChevronLeft,
  faUpload,
  faSave,
  faCog,
  faPlus,
  faCheck,
  faChevronUp,
  faChevronDown,
  faCrosshairs,
  faCopy,
  faTrash,
  faChevronRight,
  faEdit,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  // Icônes pour marqueurs
  faMonument,
  faBuilding,
  faSeedling,
  faBasketShopping,
  faPersonWalking,
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faMapMarkedAlt,
  faChevronLeft,
  faUpload,
  faSave,
  faCog,
  faPlus,
  faCheck,
  faChevronUp,
  faChevronDown,
  faCrosshairs,
  faCopy,
  faTrash,
  faChevronRight,
  faEdit,
  faTimes,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faMonument,
  faBuilding,
  faSeedling,
  faBasketShopping,
  faPersonWalking,
)

const app = createApp(PlaceEditor)
app.component('FontAwesomeIcon', FontAwesomeIcon)

// Export library pour l'utiliser dans les marqueurs
export { library }

app.mount('#app')
