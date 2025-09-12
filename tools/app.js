const { createApp, ref, reactive, onMounted, nextTick, watch } = Vue

createApp({
  setup() {
    const data = reactive({
      places: [],
      config: {
        map: {
          center: {
            latitude: 48.8566,
            longitude: 2.3522,
          },
          zoom: 13,
        },
        goToInitialUserLocation: {
          enable: false,
          threshold: 0.003,
          increaseZoom: 2,
        },
        defaultLanguage: 'fr',
        markers: {
          defaultColor: '#B87333',
          place: 'fa-monument',
          userLocation: 'fa-person-walking',
        },
      },
    })

    const currentLanguage = ref('fr')
    const availableLanguages = ref(['fr'])
    const showAddLanguage = ref(false)
    const newLanguage = ref('')
    const selectedPlaceIndex = ref(null)
    const showThresholdPreview = ref(false)
    let map = null
    let markers = []
    let thresholdCircle = null
    let userLocationMarker = null

    // Initialize current language with default language when available
    const initializeLanguage = () => {
      if (
        data.config.defaultLanguage &&
        availableLanguages.value.includes(data.config.defaultLanguage)
      ) {
        currentLanguage.value = data.config.defaultLanguage
      }
    }

    const initMap = () => {
      const center = data.config.map.center
      const zoom = data.config.map.zoom
      map = L.map('map').setView([center.latitude, center.longitude], zoom)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      map.on('click', (e) => {
        addPlaceAtCoordinates(e.latlng.lat, e.latlng.lng)
      })
    }

    const addPlaceAtCoordinates = (lat, lng) => {
      const newPlace = {
        id: `place-${Date.now()}`,
        latitude: lat,
        longitude: lng,
        imageFile: '', // Image commune à toutes les langues
        markerColor: '', // Couleur personnalisée du marqueur
        markerIcon: '', // Icône personnalisée du marqueur
        content: {},
      }

      // Initialize content for all available languages
      availableLanguages.value.forEach((lang) => {
        newPlace.content[lang] = {
          title: '',
          description: '',
          text: '',
          audioFile: '',
        }
      })

      data.places.push(newPlace)
      addMarker(newPlace, data.places.length - 1)
      selectPlace(data.places.length - 1)
    }

    const removePlace = (index) => {
      if (markers[index]) {
        map.removeLayer(markers[index])
      }
      data.places.splice(index, 1)

      // Rebuild all markers to maintain correct indices
      markers.forEach((marker) => map.removeLayer(marker))
      markers = []
      data.places.forEach((place, i) => {
        addMarker(place, i)
      })

      if (selectedPlaceIndex.value === index) {
        selectedPlaceIndex.value = null
      } else if (selectedPlaceIndex.value > index) {
        selectedPlaceIndex.value--
      }
    }

    const selectPlace = (index) => {
      selectedPlaceIndex.value = index
      const place = data.places[index]
      map.setView([place.latitude, place.longitude], 15)
    }

    const createCustomIcon = (place) => {
      // Use custom color or default from config
      const color = place.markerColor || data.config.markers?.defaultColor || '#B87333'
      // Use custom icon or default from config
      const iconClass = place.markerIcon || data.config.markers?.place || 'fa-monument'

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
            <i class="fas ${iconClass}" style="color: white; font-size: 14px;"></i>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      })
    }

    const addMarker = (place, index) => {
      const icon = createCustomIcon(place)
      const marker = L.marker([place.latitude, place.longitude], { icon }).addTo(map).bindPopup(`
          <div>
            <strong>${place.id}</strong><br>
            Lat: ${place.latitude.toFixed(6)}<br>
            Lng: ${place.longitude.toFixed(6)}<br>
            ${place.markerColor ? `Color: ${place.markerColor}<br>` : ''}
            ${place.markerIcon ? `Icon: ${place.markerIcon}<br>` : ''}
          </div>
        `)

      marker.on('click', () => {
        selectPlace(index)
      })

      markers[index] = marker
    }

    const updateMarker = (index) => {
      const place = data.places[index]
      if (markers[index]) {
        map.removeLayer(markers[index])
      }
      addMarker(place, index)
    }

    const updateAvailableLanguages = () => {
      const languages = new Set([data.config.defaultLanguage || 'fr'])
      data.places.forEach((place) => {
        Object.keys(place.content || {}).forEach((lang) => {
          languages.add(lang)
        })
      })
      availableLanguages.value = Array.from(languages)
    }

    const addLanguage = () => {
      const lang = newLanguage.value.trim().toLowerCase()
      if (lang && !availableLanguages.value.includes(lang)) {
        availableLanguages.value.push(lang)

        // Add content for this language to ALL existing places
        data.places.forEach((place) => {
          if (!place.content[lang]) {
            place.content[lang] = {
              title: '',
              description: '',
              text: '',
              audioFile: '',
            }
          }
        })

        currentLanguage.value = lang
        newLanguage.value = ''
        showAddLanguage.value = false
      }
    }

    const isLanguageComplete = (place, language) => {
      const content = place.content[language]
      if (!content) return false
      return content.title && content.description && content.text
    }

    const applyMapConfig = () => {
      const center = data.config.map.center
      const zoom = data.config.map.zoom
      map.setView([center.latitude, center.longitude], zoom)
    }

    const captureCurrentView = () => {
      if (map) {
        const center = map.getCenter()
        const zoom = map.getZoom()

        data.config.map.center.latitude = center.lat
        data.config.map.center.longitude = center.lng
        data.config.map.zoom = zoom
      }
    }

    const triggerFileInput = () => {
      const fileInput = document.getElementById('file-input')
      if (fileInput) {
        fileInput.click()
      }
    }

    const loadFile = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result)

          // Ensure places array exists
          if (!jsonData.places) {
            jsonData.places = []
          }

          // Merge config with defaults if not present
          if (!jsonData.config) {
            jsonData.config = {
              map: {
                center: { latitude: 48.8566, longitude: 2.3522 },
                zoom: 13,
              },
              defaultLanguage: 'fr',
            }
          } else {
            // Ensure all config properties exist
            if (!jsonData.config.map) {
              jsonData.config.map = {
                center: { latitude: 48.8566, longitude: 2.3522 },
                zoom: 13,
              }
            }
            if (!jsonData.config.map.center) {
              jsonData.config.map.center = { latitude: 48.8566, longitude: 2.3522 }
            }
            if (!jsonData.config.map.zoom) {
              jsonData.config.map.zoom = 13
            }
            if (!jsonData.config.defaultLanguage) {
              jsonData.config.defaultLanguage = 'fr'
            }
            if (!jsonData.config.markers) {
              jsonData.config.markers = {
                defaultColor: '#B87333',
                place: 'fa-monument',
                userLocation: 'fa-person-walking',
              }
            } else {
              if (!jsonData.config.markers.defaultColor) {
                jsonData.config.markers.defaultColor = '#B87333'
              }
              if (!jsonData.config.markers.place) {
                jsonData.config.markers.place = 'fa-monument'
              }
              if (!jsonData.config.markers.userLocation) {
                jsonData.config.markers.userLocation = 'fa-person-walking'
              }
            }
          }

          // Clear current data
          data.places.splice(0)

          // Assign new data
          Object.assign(data, jsonData)

          // Migrate existing places to new structure
          data.places.forEach((place) => {
            // Si imageFile n'existe pas au niveau du lieu, l'ajouter
            if (!place.hasOwnProperty('imageFile')) {
              // Essayer de récupérer l'imageFile depuis le premier contenu disponible
              let migratedImageFile = ''
              Object.keys(place.content || {}).forEach((lang) => {
                if (place.content[lang].imageFile && !migratedImageFile) {
                  migratedImageFile = place.content[lang].imageFile
                }
              })
              place.imageFile = migratedImageFile
            }

            // Supprimer imageFile des contenus spécifiques aux langues
            Object.keys(place.content || {}).forEach((lang) => {
              if (place.content[lang].hasOwnProperty('imageFile')) {
                delete place.content[lang].imageFile
              }
            })
          })

          // Update map view with new config
          const center = data.config.map.center
          const zoom = data.config.map.zoom
          map.setView([center.latitude, center.longitude], zoom)

          // Clean existing markers
          markers.forEach((marker) => map.removeLayer(marker))
          markers = []

          // Add new markers
          data.places.forEach((place, index) => {
            addMarker(place, index)
          })

          updateAvailableLanguages()
          initializeLanguage()

          if (data.places.length > 0) {
            const bounds = L.latLngBounds(data.places.map((p) => [p.latitude, p.longitude]))
            map.fitBounds(bounds)
            selectPlace(0)
          } else {
            selectedPlaceIndex.value = null
          }

          // Reset file input
          event.target.value = ''
        } catch (error) {
          alert('Error loading JSON file: ' + error.message)
          console.error('Load file error:', error)
        }
      }
      reader.readAsText(file)
    }

    const saveFile = () => {
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = 'data.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }

    // Threshold circle management
    const toggleThresholdPreview = () => {
      if (showThresholdPreview.value) {
        showThresholdCircle()
        showUserLocationMarker()
      } else {
        hideThresholdCircle()
        hideUserLocationMarker()
      }
    }

    const showThresholdCircle = () => {
      if (thresholdCircle) {
        map.removeLayer(thresholdCircle)
      }

      const center = data.config.map.center
      const threshold = data.config.goToInitialUserLocation.threshold

      // Convert threshold (in degrees) to meters for circle radius
      // Approximation: 1 degree ≈ 111,000 meters at the equator
      const radiusInMeters = threshold * 111000

      thresholdCircle = L.circle([center.latitude, center.longitude], {
        radius: radiusInMeters,
        color: '#3498db',
        fillColor: '#3498db',
        fillOpacity: 0.1,
        weight: 2,
        dashArray: '5, 5',
      }).addTo(map)

      thresholdCircle.bindPopup(
        `Auto-center threshold: ${threshold} degrees (≈${Math.round(radiusInMeters)}m)`,
      )
    }

    const hideThresholdCircle = () => {
      if (thresholdCircle) {
        map.removeLayer(thresholdCircle)
        thresholdCircle = null
      }
    }

    // User location marker management
    const showUserLocationMarker = () => {
      if (userLocationMarker) {
        map.removeLayer(userLocationMarker)
      }

      const center = data.config.map.center

      // Create a custom icon using FontAwesome
      const userIcon = L.divIcon({
        html: '<i class="fas fa-person-walking" style="color: #e74c3c; font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        className: 'user-location-icon',
      })

      userLocationMarker = L.marker([center.latitude, center.longitude], {
        icon: userIcon,
      }).addTo(map)

      userLocationMarker.bindPopup('User location (simulated at map center)')
    }

    const hideUserLocationMarker = () => {
      if (userLocationMarker) {
        map.removeLayer(userLocationMarker)
        userLocationMarker = null
      }
    }

    onMounted(() => {
      nextTick(() => {
        initMap()
      })
    })

    // Watch for threshold changes and update circle if preview is active
    watch(
      () => data.config.goToInitialUserLocation.threshold,
      () => {
        if (showThresholdPreview.value && thresholdCircle) {
          showThresholdCircle()
        }
        if (showThresholdPreview.value && userLocationMarker) {
          showUserLocationMarker()
        }
      },
    )

    const applyPreset = (index, color, icon) => {
      if (data.places[index]) {
        data.places[index].markerColor = color
        data.places[index].markerIcon = icon
        updateMarker(index)
      }
    }

    return {
      data,
      currentLanguage,
      availableLanguages,
      showAddLanguage,
      newLanguage,
      selectedPlaceIndex,
      showThresholdPreview,
      removePlace,
      selectPlace,
      updateMarker,
      addLanguage,
      isLanguageComplete,
      applyMapConfig,
      captureCurrentView,
      triggerFileInput,
      loadFile,
      saveFile,
      initializeLanguage,
      toggleThresholdPreview,
      applyPreset,
    }
  },
}).mount('#app')
