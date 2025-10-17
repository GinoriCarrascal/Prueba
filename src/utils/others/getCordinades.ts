import { getCordinades } from "../../services/api/getCoordinades"

// 📍 Función auxiliar fuera del scope principal
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distancia en km
}

async function obtenerCoordenadas(num: any, direccion: any): Promise<number | undefined> {
  const direccionCodificada = encodeURIComponent(direccion)

  try {
    const data = await getCordinades(num, direccionCodificada)
    let lat1: number, lon1: number

    if (data.features && data.features.length > 0) {
      lat1 = data.features[0].geometry.coordinates[1]
      lon1 = data.features[0].geometry.coordinates[0]
    } else {
      console.log("Pedir una referencia.")
      return
    }

    // 📍 Carretero (destino fijo)
    const lat2 = -7.14995
    const lon2 = -78.506302

    const distancia = haversine(lat1, lon1, lat2, lon2)

    // Fórmula de precio
   // let precio = 15 + (distancia - 10) * 1
    return Math.round(1)
  } catch (error: any) {
    console.error(`Error al realizar la solicitud: ${error.message}`)
  }
}

export { obtenerCoordenadas }
