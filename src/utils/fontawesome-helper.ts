/**
 * Helper pour générer des icônes Font Awesome SVG pour les marqueurs Leaflet
 */
import { icon, type IconName } from '@fortawesome/fontawesome-svg-core'

/**
 * Génère le HTML SVG d'une icône Font Awesome
 * @param iconName - Nom de l'icône sans le préfixe "fa-" (ex: "monument", "building")
 * @returns HTML string de l'icône SVG
 */
export function getFontAwesomeSVG(iconName: string): string {
  // Retirer le préfixe "fa-" si présent
  const cleanIconName = iconName.startsWith('fa-') ? iconName.substring(3) : iconName

  try {
    // Générer l'icône SVG avec Font Awesome
    const faIcon = icon({ prefix: 'fas', iconName: cleanIconName as IconName })

    if (faIcon && faIcon.html && faIcon.html[0]) {
      return faIcon.html[0]
    }
  } catch {
    console.warn(`Icône Font Awesome non trouvée: ${cleanIconName}`)
  }

  // Fallback : retourner une icône par défaut
  return '<svg viewBox="0 0 384 512" fill="currentColor"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>'
}
