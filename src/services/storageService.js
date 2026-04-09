// src/services/storageService.js

const STORAGE_KEYS = {
  WISHLIST: 'gametrack_wishlist',
  BACKLOG: 'gametrack_backlog'
}

// Guardar wishlist
export const saveWishlist = (games) => {
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(games))
  return Promise.resolve()  // Preparado para futuro async
}

// Cargar wishlist
export const loadWishlist = () => {
  const data = localStorage.getItem(STORAGE_KEYS.WISHLIST)
  return Promise.resolve(data ? JSON.parse(data) : [])
}

// Guardar backlog
export const saveBacklog = (games) => {
  localStorage.setItem(STORAGE_KEYS.BACKLOG, JSON.stringify(games))
  return Promise.resolve()
}

// Cargar backlog
export const loadBacklog = () => {
  const data = localStorage.getItem(STORAGE_KEYS.BACKLOG)
  return Promise.resolve(data ? JSON.parse(data) : [])
}

// Limpiar todos los datos
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.WISHLIST)
  localStorage.removeItem(STORAGE_KEYS.BACKLOG)
  return Promise.resolve()
}