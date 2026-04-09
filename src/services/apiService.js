// src/services/apiService.js

const API_KEY = 'aa78d56324f04df7b038c7109b6ccc34'  
const BASE_URL = 'https://api.rawg.io/api'

export const searchGames = async (query) => {
  if (!query || query.length < 2) return []
  
  try {
    const response = await fetch(
      `${BASE_URL}/games?key=${API_KEY}&search=${encodeURIComponent(query)}&page_size=20`
    )
    const data = await response.json()
    return data.results || []
  } catch (error) {
    console.error('Error buscando juegos:', error)
    return []
  }
}

export const getGameDetails = async (gameId) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`)
    return await response.json()
  } catch (error) {
    console.error('Error obteniendo detalles:', error)
    return null
  }
}