/**
 * Types audio minimalistes (basés sur data.json existant)
 */

/**
 * États de base du lecteur
 */
export enum AudioState {
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  STOPPED = 'STOPPED',
}

/**
 * État simple du lecteur
 */
export interface AudioPlayerState {
  /** État actuel */
  state: AudioState
  /** Position en secondes */
  currentTime: number
  /** Volume (0-1) */
  volume: number
}

/**
 * État de lecture audio étendu
 */
export interface AudioPlaybackState {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
}
