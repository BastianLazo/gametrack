export const exportData = (wishlist, backlog) => {
  const data = { wishlist, backlog, exportDate: new Date().toISOString() }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gametrack-backup-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = (file, setWishlist, setBacklog, saveWishlist, saveBacklog) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        setWishlist(data.wishlist || [])
        setBacklog(data.backlog || [])
        saveWishlist(data.wishlist || [])
        saveBacklog(data.backlog || [])
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsText(file)
  })
}