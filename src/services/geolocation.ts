/**
 * Optional geolocation. Only asks when the player opts in, and only
 * returns what the weather service needs.
 */
export type Position = { latitude: number; longitude: number }

export function geolocalisationDisponible() {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator
}

export function demanderPosition(): Promise<Position> {
  return new Promise((resolve, reject) => {
    if (!geolocalisationDisponible()) {
      reject(new Error('Géolocalisation indisponible'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 10 * 60 * 1000 },
    )
  })
}
