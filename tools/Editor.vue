<template>
  <div class="fullscreen-container">
    <!-- Fullscreen map -->
    <div id="map"></div>

    <!-- Floating panel - Places list -->
    <div class="floating-panel places-panel" :class="{ 'is-collapsed': !showPlaces }">
      <div v-if="showPlaces" class="panel-header">
        <div class="panel-title">
          <font-awesome-icon icon="map-marked-alt" class="mr-2" />
          Places ({{ data.places.length }})
        </div>
        <button @click="showPlaces = false" class="toggle-btn">
          <font-awesome-icon icon="chevron-left" />
        </button>
      </div>

      <div v-if="showPlaces" class="panel-content" ref="panelContentRef">
        <!-- Controls -->
        <div class="controls">
          <button type="button" @click.stop="loadData" class="button is-primary is-small" :disabled="loadDataDisabled">
            <font-awesome-icon icon="upload" /> Load
          </button>
          <button type="button" @click.stop.prevent="saveData($event)" class="button is-success is-small" :disabled="!data.places.length">
            <font-awesome-icon icon="save" /> Save
          </button>
          <button type="button" @click.stop="openConfig" class="button is-info is-small">
            <font-awesome-icon icon="cog" /> Config
          </button>
        </div>

        <!-- Language selector -->
        <div class="language-selector">
          <select v-model="currentLang" class="select is-small">
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">
              {{ getLanguageName(lang) }}
            </option>
          </select>
          <button @click="showAddLanguage = !showAddLanguage" class="button is-small">
            <font-awesome-icon icon="plus" />
          </button>
        </div>

        <!-- Add language -->
        <div v-if="showAddLanguage" class="add-language">
          <input v-model="newLanguage" class="input is-small" placeholder="Language code (ex: es, it)">
          <button @click="addLanguage" class="button is-success is-small">
            <font-awesome-icon icon="check" />
          </button>
        </div>

        <!-- Places list -->
        <div class="places-list">
          <div
            v-for="(place, index) in data.places"
            :key="place.id"
            class="place-item"
            :class="{ 'is-active': selectedPlace === index }"
            @click="selectPlace(index)"
          >
            <div class="place-header">
              <div class="place-order">
                <span class="order-number">{{ index + 1 }}</span>
                <div class="order-controls">
                  <button @click.stop="moveUp(index)" class="button is-small" :disabled="index === 0">
                    <font-awesome-icon icon="chevron-up" />
                  </button>
                  <button @click.stop="moveDown(index)" class="button is-small" :disabled="index === data.places.length - 1">
                    <font-awesome-icon icon="chevron-down" />
                  </button>
                </div>
              </div>
              <div class="place-title">
                <strong>{{ place.content[currentLang]?.title || place.id }}</strong>
              </div>
              <div class="place-actions">
                <button @click.stop="centerOnPlace(place)" class="button is-small is-info">
                  <font-awesome-icon icon="crosshairs" />
                </button>
                <button @click.stop="duplicatePlace(index)" class="button is-small is-warning">
                  <font-awesome-icon icon="copy" />
                </button>
                <button @click.stop="removePlace(index)" class="button is-small is-danger">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </div>
            <div class="place-coords">
              {{ place.latitude.toFixed(6) }}, {{ place.longitude.toFixed(6) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reopen button when panel is closed -->
    <div v-if="!showPlaces" class="collapsed-toggle-btn" @click="showPlaces = true">
      <font-awesome-icon icon="chevron-right" />
    </div>

    <!-- Floating panel - Editor -->
    <div v-if="selectedPlace !== null" class="floating-panel editor-panel">
      <div class="panel-header">
        <div class="panel-title">
          <font-awesome-icon icon="edit" class="mr-2" />
          {{ currentPlace.content[currentLang]?.title || currentPlace.id }}
        </div>
        <button @click="selectedPlace = null" class="close-btn">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="panel-content editor-content">
        <!-- ID and coordinates -->
        <div class="field">
          <label class="label is-small">ID</label>
          <input v-model="currentPlace.id" class="input is-small" placeholder="Unique identifier">
        </div>

        <div class="field-group">
          <div class="field">
            <label class="label is-small">Latitude</label>
            <input v-model.number="currentPlace.latitude" class="input is-small" type="number" step="0.000001" @change="updateMarker">
          </div>
          <div class="field">
            <label class="label is-small">Longitude</label>
            <input v-model.number="currentPlace.longitude" class="input is-small" type="number" step="0.000001" @change="updateMarker">
          </div>
        </div>

        <!-- Marker customization -->
        <div class="field-group">
          <div class="field">
            <label class="label is-small">Color</label>
            <input v-model="currentPlace.markerColor" class="input is-small" type="color" @change="updateMarker">
          </div>
          <div class="field">
            <label class="label is-small">Icon</label>
            <input v-model="currentPlace.markerIcon" class="input is-small" placeholder="fa-monument" @change="updateMarker">
          </div>
        </div>

        <!-- Image file -->
        <div class="field">
          <label class="label is-small">Image file</label>
          <input v-model="currentPlace.imageFile" class="input is-small" placeholder="image.jpg">
        </div>

        <!-- Content -->
        <div class="language-content">
          <h6 class="subtitle is-6">Content ({{ getLanguageName(currentLang) }})</h6>

          <div class="field">
            <label class="label is-small">Title</label>
            <input v-model="currentPlace.content[currentLang].title" class="input is-small" placeholder="Place title">
          </div>

          <div class="field">
            <label class="label is-small">Description</label>
            <textarea v-model="currentPlace.content[currentLang].description" class="textarea is-small" rows="2" placeholder="Short description"></textarea>
          </div>

          <div class="field">
            <label class="label is-small">Full text</label>
            <textarea v-model="currentPlace.content[currentLang].text" class="textarea is-small" rows="4" placeholder="Audio guide text"></textarea>
          </div>

          <div class="field">
            <label class="label is-small">Audio file</label>
            <input v-model="currentPlace.content[currentLang].audioFile" class="input is-small" placeholder="file.mp3">
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Configuration -->
    <div v-if="showConfigPanel" class="modal is-active">
      <div class="modal-background" @click="showConfigPanel = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Configuration</p>
          <button @click="showConfigPanel = false" class="delete"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Map center</label>
            <div class="field-group">
              <div class="field">
                <label class="label is-small">Latitude</label>
                <input v-model.number="configTemp.latitude" class="input" type="number" step="0.000001">
              </div>
              <div class="field">
                <label class="label is-small">Longitude</label>
                <input v-model.number="configTemp.longitude" class="input" type="number" step="0.000001">
              </div>
            </div>
          </div>
          <div class="field">
            <label class="label">Default zoom</label>
            <input v-model.number="configTemp.zoom" class="input" type="number" min="1" max="20">
          </div>
          <div class="field">
            <label class="label">Default marker color</label>
            <input v-model="configTemp.defaultColor" class="input" type="color">
          </div>
        </section>
        <footer class="modal-card-foot">
          <button @click="applyConfig" class="button is-success">Apply</button>
          <button @click="showConfigPanel = false" class="button">Cancel</button>
        </footer>
      </div>
    </div>

    <!-- Toast notifications -->
    <div class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="`toast-${toast.type}`"
        @click="removeToast(toast.id)"
      >
        <div class="toast-content">
          <font-awesome-icon
            :icon="toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'exclamation-circle' : 'info-circle'"
          />
          <span>{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import L from 'leaflet'
import { getFontAwesomeSVG } from './fontawesome-helper.js'

const data = reactive({
  config: {
    map: {
      center: { latitude: 48.8566, longitude: 2.3522 },
      zoom: 13
    },
    defaultLanguage: 'fr',
    markers: {
      defaultColor: '#B87333',
      place: 'fa-monument',
      userLocation: 'fa-person-walking'
    }
  },
  places: []
})

const currentLang = ref('fr')
const availableLanguages = ref(['fr', 'en', 'de'])
const selectedPlace = ref<number | null>(null)
const showPlaces = ref(true)
const showConfigPanel = ref(false)
const showAddLanguage = ref(false)
const newLanguage = ref('')
const panelContentRef = ref<HTMLElement>()
const loadDataDisabled = ref(false)

// Protection against multiple calls
let isSaving = false

// Toast system
const toasts = ref<Array<{id: number, message: string, type: 'success' | 'error' | 'info'}>>([])
let toastId = 0

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }, 4000)
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Define place types
interface PlaceContent {
  title: string
  description: string
  text: string
  audioFile: string
}

interface Place {
  id: string
  latitude: number
  longitude: number
  order: number
  imageFile?: string
  markerColor?: string
  markerIcon?: string
  content: Record<string, PlaceContent>
}

const configTemp = reactive({
  latitude: 48.8566,
  longitude: 2.3522,
  zoom: 13,
  defaultColor: '#B87333'
})

// Initialize configTemp with current data values
const initConfigTemp = () => {
  configTemp.latitude = data.config.map.center.latitude
  configTemp.longitude = data.config.map.center.longitude
  configTemp.zoom = data.config.map.zoom
  configTemp.defaultColor = data.config.markers?.defaultColor || '#B87333'
}

const openConfig = () => {
  initConfigTemp() // Refresh config values
  showConfigPanel.value = true
}

let map: L.Map | null = null
let markers: L.Marker[] = []
let selectedMarkerCircle: L.Circle | null = null



const currentPlace = computed(() => {
  return selectedPlace.value !== null ? data.places[selectedPlace.value] : null
})

// Helper functions
const getLanguageName = (lang: string) => {
  const names: Record<string, string> = {
    fr: 'Français',
    en: 'English',
    de: 'Deutsch',
    es: 'Español',
    it: 'Italiano'
  }
  return names[lang] || lang.toUpperCase()
}

const createCustomIcon = (place: Place) => {
  const color = place.markerColor || data.config.markers?.defaultColor || '#B87333'
  const iconClass = place.markerIcon || data.config.markers?.place || 'fa-monument'
  const iconSVG = getFontAwesomeSVG(iconClass)

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        ${iconSVG}
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

const initMap = () => {
  const center = data.config.map.center
  map = L.map('map', { preferCanvas: true }).setView([center.latitude, center.longitude], data.config.map.zoom)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  map.on('click', (e: L.LeafletMouseEvent) => {
    addPlace(e.latlng.lat, e.latlng.lng)
  })
}

const addPlace = (lat: number, lng: number) => {
  const newPlace: Place = {
    id: `place-${Date.now()}`,
    latitude: lat,
    longitude: lng,
    order: data.places.length + 1,
    markerColor: data.config.markers?.defaultColor || '#B87333',
    markerIcon: data.config.markers?.place || 'fa-monument',
    imageFile: '',
    content: {}
  }

  // Default values are set to avoid empty fields that cause Vue remounts

  // Initialize content for all available languages
  availableLanguages.value.forEach((lang) => {
    newPlace.content[lang] = {
      title: '',
      description: '',
      text: '',
      audioFile: ''
    }
  })

  data.places.push(newPlace)
  addMarker(newPlace, data.places.length - 1)
  selectedPlace.value = data.places.length - 1
}

const addMarker = (place: Place, index: number) => {
  const icon = createCustomIcon(place)
  const marker = L.marker([place.latitude, place.longitude], {
    icon,
    draggable: true
  }).addTo(map!).bindPopup(`
    <div>
      <strong>${place.id}</strong><br>
      ${place.content[currentLang.value]?.title || ''}<br>
      Lat: ${place.latitude.toFixed(6)}<br>
      Lng: ${place.longitude.toFixed(6)}
    </div>
  `)

  marker.on('click', () => {
    selectPlace(index)
  })

  marker.on('dragend', (e: L.DragEndEvent) => {
    const newLatLng = (e.target as L.Marker).getLatLng()
    data.places[index].latitude = newLatLng.lat
    data.places[index].longitude = newLatLng.lng
    updateMarkerPopup(marker, place)
  })

  markers[index] = marker
}

const updateMarkerPopup = (marker: L.Marker, place: Place) => {
  marker.setPopupContent(`
    <div>
      <strong>${place.id}</strong><br>
      ${place.content[currentLang.value]?.title || ''}<br>
      Lat: ${place.latitude.toFixed(6)}<br>
      Lng: ${place.longitude.toFixed(6)}
    </div>
  `)
}

const updateMarker = () => {
  if (selectedPlace.value !== null && markers[selectedPlace.value]) {
    const place = data.places[selectedPlace.value]
    const marker = markers[selectedPlace.value]

    // Update position
    marker.setLatLng([place.latitude, place.longitude])

    // Update icon
    const newIcon = createCustomIcon(place)
    marker.setIcon(newIcon)

    // Update popup
    updateMarkerPopup(marker, place)

    // Update selection highlight circle position
    if (selectedMarkerCircle) {
      selectedMarkerCircle.setLatLng([place.latitude, place.longitude])
    }
  }
}

const selectPlace = (index: number) => {
  selectedPlace.value = index
  const place = data.places[index]

  // Remove existing highlight circle
  if (selectedMarkerCircle) {
    map!.removeLayer(selectedMarkerCircle)
    selectedMarkerCircle = null
  }

  // Add highlight circle around selected marker
  selectedMarkerCircle = L.circle([place.latitude, place.longitude], {
    color: '#ff6b6b',
    fillColor: '#ff6b6b',
    fillOpacity: 0.1,
    radius: 50,
    weight: 3,
    dashArray: '10, 5'
  }).addTo(map!)

  const currentZoom = map!.getZoom()
  map!.setView([place.latitude, place.longitude], Math.max(currentZoom, 15))
}

const removePlace = (index: number) => {
  if (markers[index]) {
    map!.removeLayer(markers[index])
  }
  data.places.splice(index, 1)

  // Rebuild all markers
  markers.forEach(marker => marker && map!.removeLayer(marker))
  markers = []

  // Remove selection highlight
  if (selectedMarkerCircle) {
    map!.removeLayer(selectedMarkerCircle)
    selectedMarkerCircle = null
  }

  data.places.forEach((place, i) => addMarker(place, i))

  // Update selection
  if (selectedPlace.value === index) {
    selectedPlace.value = null
  } else if (selectedPlace.value && selectedPlace.value > index) {
    selectedPlace.value--
  }
}

const duplicatePlace = (index: number) => {
  const original = data.places[index]
  const duplicate = JSON.parse(JSON.stringify(original))
  duplicate.id = `${original.id}-copy-${Date.now()}`
  duplicate.latitude += 0.001
  duplicate.longitude += 0.001

  data.places.push(duplicate)
  addMarker(duplicate, data.places.length - 1)
  selectedPlace.value = data.places.length - 1
}

const centerOnPlace = (place: Place) => {
  const currentZoom = map!.getZoom()
  map!.setView([place.latitude, place.longitude], Math.max(currentZoom, 16))
}

const moveUp = (index: number) => {
  if (index > 0) {
    [data.places[index], data.places[index - 1]] = [data.places[index - 1], data.places[index]]
    if (selectedPlace.value === index) selectedPlace.value = index - 1
    else if (selectedPlace.value === index - 1) selectedPlace.value = index
  }
}

const moveDown = (index: number) => {
  if (index < data.places.length - 1) {
    [data.places[index], data.places[index + 1]] = [data.places[index + 1], data.places[index]]
    if (selectedPlace.value === index) selectedPlace.value = index + 1
    else if (selectedPlace.value === index + 1) selectedPlace.value = index
  }
}

const addLanguage = () => {
  const lang = newLanguage.value.trim().toLowerCase()
  if (lang && !availableLanguages.value.includes(lang)) {
    availableLanguages.value.push(lang)

    // Add content for this language to all places
    data.places.forEach(place => {
      if (!place.content[lang]) {
        place.content[lang] = {
          title: '',
          description: '',
          text: '',
          audioFile: ''
        }
      }
    })

    currentLang.value = lang
    newLanguage.value = ''
    showAddLanguage.value = false
  }
}

const applyConfig = () => {
  data.config.map.center.latitude = configTemp.latitude
  data.config.map.center.longitude = configTemp.longitude
  data.config.map.zoom = configTemp.zoom

  // Ensure markers config exists
  if (!data.config.markers) {
    data.config.markers = {
      defaultColor: '#B87333',
      place: 'fa-monument',
      userLocation: 'fa-person-walking'
    }
  }
  data.config.markers.defaultColor = configTemp.defaultColor

  // Update map view
  map!.setView([configTemp.latitude, configTemp.longitude], configTemp.zoom)

  showConfigPanel.value = false
}

const loadData = async () => {
  if (isSaving || loadDataDisabled.value) {
    return
  }

  // Add a small delay to prevent interference with saveData
  await new Promise(resolve => setTimeout(resolve, 100))

  try {
    let jsonData = null

    try {
      // First try: Use fetch (works better in tools context)
      const response = await fetch(`/src/data/data.json?t=${Date.now()}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const text = await response.text()

      // Check if we got HTML instead of JSON
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        throw new Error('Received HTML instead of JSON - check server configuration')
      }

      jsonData = JSON.parse(text)
    } catch {
      // Second try: Use import with cache busting as fallback
      const timestamp = Date.now()
      const module = await import(`@/data/data.json?t=${timestamp}`)
      jsonData = module.default
    }

    if (!jsonData) {
      throw new Error('No data loaded')
    }

    // Clear existing data
    markers.forEach(marker => marker && map!.removeLayer(marker))
    markers = []

    // Remove selection highlight if any
    if (selectedMarkerCircle) {
      map!.removeLayer(selectedMarkerCircle)
      selectedMarkerCircle = null
    }

    // Load new data
    Object.assign(data, jsonData)

    // Update config temp values
    initConfigTemp()

    // Ensure config structure exists
    if (!data.config.markers) {
      data.config.markers = {
        defaultColor: '#B87333',
        place: 'fa-monument',
        userLocation: 'fa-person-walking'
      }
    }

    // Ensure all places have required properties
    data.places.forEach(place => {
      if (!place.imageFile) place.imageFile = ''
      if (!place.markerColor || place.markerColor === '') place.markerColor = data.config.markers?.defaultColor || '#B87333'
      if (!place.markerIcon) place.markerIcon = data.config.markers?.place || 'fa-monument'

      // Ensure content exists for all available languages
      availableLanguages.value.forEach(lang => {
        if (!place.content[lang]) {
          place.content[lang] = { title: '', description: '', text: '', audioFile: '' }
        }
      })
    })

    // Update available languages based on loaded data
    const languagesInData = new Set<string>()
    data.places.forEach(place => {
      Object.keys(place.content || {}).forEach(lang => languagesInData.add(lang))
    })
    availableLanguages.value = Array.from(languagesInData).sort()

    if (data.config.defaultLanguage && availableLanguages.value.includes(data.config.defaultLanguage)) {
      currentLang.value = data.config.defaultLanguage
    }

    // Update map view
    if (data.config.map.center) {
      map!.setView([data.config.map.center.latitude, data.config.map.center.longitude], data.config.map.zoom)
    }

    // Re-create markers
    data.places.forEach((place, index) => addMarker(place, index))

    if (data.places.length > 0) {
      const bounds = L.latLngBounds(data.places.map(p => [p.latitude, p.longitude]))
      map!.fitBounds(bounds)
      selectPlace(0)
    }

    showToast('Data loaded successfully!', 'success')
  } catch (error: Error) {
    console.error('Loading error:', error)
    showToast('Loading error: ' + error.message, 'error')
  }
}

const saveData = async (event?: Event) => {
  if (isSaving) {
    return
  }

  isSaving = true
  loadDataDisabled.value = true

  // Prevent any default behavior that might cause page reload
  if (event) {
    event.preventDefault()
    event.stopPropagation()
    event.stopImmediatePropagation()
  }

  try {
    // Create a deep copy to avoid modifying original data
    const dataToSave = JSON.parse(JSON.stringify(data))

    // Clean up places: remove default values
    dataToSave.places.forEach((place: Place) => {
      if (place.markerColor === dataToSave.config.markers?.defaultColor) {
        delete place.markerColor
      }
      if (place.markerIcon === dataToSave.config.markers?.place) {
        delete place.markerIcon
      }
      if (!place.imageFile?.trim()) {
        delete place.imageFile
      }
    })

    const jsonData = JSON.stringify(dataToSave, null, 2)

    // Try to save directly to file system via Node.js API
    const response = await fetch('/api/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: jsonData })
    })

    if (response.ok) {
      showToast('File saved successfully!', 'success')
      return
    } else {
      throw new Error(`Server error: ${response.status}`)
    }
  } catch {
    // Fallback to download if server save fails

    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })

    // Use a more reliable download method
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      // IE workaround
      window.navigator.msSaveOrOpenBlob(blob, 'data.json')
    } else {
      const url = URL.createObjectURL(blob)

      // Create download link with better isolation
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = url
        a.download = 'data.json'
        a.style.position = 'absolute'
        a.style.left = '-9999px'
        a.style.visibility = 'hidden'

        document.body.appendChild(a)

        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
          a.click()
          setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }, 100)
        }, 10)
      }, 10)
    }

    showToast('File downloaded! Manually replace src/data/data.json with this file.', 'info')
  }

  isSaving = false
  loadDataDisabled.value = false
}

onMounted(() => {
  initMap()
  initConfigTemp()
})
</script>

<style scoped>
.fullscreen-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

#map {
  width: 100%;
  height: 100vh;
}

.floating-panel {
  position: absolute;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.places-panel {
  top: 20px;
  left: 70px;  /* Décalage pour laisser voir les contrôles de zoom */
  width: 350px;
  transition: transform 0.3s ease;
}

.places-panel.is-collapsed {
  transform: translateX(-320px);
}

.collapsed-toggle-btn {
  position: absolute;
  top: 50%;
  left: 0;  /* Collé à gauche */
  transform: translateY(-50%);
  background: white;
  border: 1px solid #dbdbdb;
  border-left: none;  /* Pas de bordure à gauche pour coller */
  border-radius: 0 8px 8px 0;
  padding: 12px 8px;
  cursor: pointer;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1002;
  transition: all 0.2s ease;
}

.collapsed-toggle-btn:hover {
  background: #f5f5f5;
  transform: translateY(-50%) translateX(3px);
}

.editor-panel {
  top: 20px;
  right: 20px;  /* Plus à droite */
  width: 320px;  /* Plus serré */
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-bottom: 1px solid #dbdbdb;
  font-weight: bold;
}

.panel-title {
  display: flex;
  align-items: center;
}

.toggle-btn, .close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 4px;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.button-separator {
  width: 1px;
  height: 20px;
  background: #dbdbdb;
  margin: 0 0.5rem;
}

.language-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-language {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.places-list {
  max-height: 400px;
  overflow-y: auto;
}

.place-item {
  padding: 0.75rem;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.place-item:hover {
  background-color: #f0f0f0;
}

.place-item.is-active {
  background-color: #3273dc;
  color: white;
  border-color: #3273dc;
}

.place-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.place-order {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.order-number {
  background: #363636;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.75rem;
  min-width: 20px;
  text-align: center;
}

.place-item.is-active .order-number {
  background: white;
  color: #3273dc;
}

.order-controls {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.order-controls .button {
  padding: 1px 4px;
  font-size: 0.6rem;
  height: auto;
}

.place-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-actions {
  display: flex;
  gap: 0.25rem;
}

.place-coords {
  font-size: 0.75rem;
  opacity: 0.8;
  margin-left: 60px;
}

.editor-content {
  width: 100%;
}

.field-group {
  display: flex;
  gap: 0.5rem;
}

.field-group .field {
  flex: 1;
}

.language-content {
  border-top: 1px solid #dbdbdb;
  padding-top: 1rem;
  margin-top: 1rem;
}

.custom-marker {
  background: transparent !important;
  border: none !important;
}

.modal {
  z-index: 2000 !important;
}

.modal-card {
  max-width: 500px;
}

.field {
  margin-bottom: 1rem;
}

.label.is-small {
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.button.is-small {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
}

/* Toast notifications */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideInRight 0.3s ease-out;
  cursor: pointer;
  border-left: 4px solid;
}

.toast-success {
  border-left-color: #28a745;
}

.toast-error {
  border-left-color: #dc3545;
}

.toast-info {
  border-left-color: #17a2b8;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.toast-success .fas {
  color: #28a745;
}

.toast-error .fas {
  color: #dc3545;
}

.toast-info .fas {
  color: #17a2b8;
}

.toast-close {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: #f8f9fa;
  color: #495057;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Styles pour les SVG dans les marqueurs */
.custom-marker svg {
  width: 14px;
  height: 14px;
  fill: white;
  display: block;
}

</style>
