// src/services/cheapsharkService.js

const CHEAPSHARK_API = 'https://www.cheapshark.com/api/1.0'

// Buscar ofertas por nombre del juego
export const getGameDeals = async (gameName) => {
  try {
    const response = await fetch(
      `${CHEAPSHARK_API}/deals?title=${encodeURIComponent(gameName)}&pageSize=3`
    )
    const data = await response.json()
    return data || []
  } catch (error) {
    console.error('Error buscando ofertas:', error)
    return []
  }
}

// Obtener detalles de una oferta específica
export const getDealInfo = async (dealId) => {
  try {
    const response = await fetch(`${CHEAPSHARK_API}/deals?id=${dealId}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo oferta:', error)
    return null
  }
}

// Formatear precio
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`
}