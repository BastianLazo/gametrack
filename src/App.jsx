// src/App.jsx
import { useState, useEffect } from 'react'
import { searchGames } from './services/apiService'
import { saveWishlist, loadWishlist, saveBacklog, loadBacklog, updateGameStatus } from './services/storageService'
import GameCard from './components/GameCard'
import Statistics from './components/Statistics'
import RandomPicker from './components/RandomPicker'
import SkeletonLoader from './components/SkeletonLoader'
import { useTheme } from './context/ThemeContext'
import confetti from 'canvas-confetti'

function App() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [backlog, setBacklog] = useState([])
  const [activeTab, setActiveTab] = useState('search')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    const loadData = async () => {
      const savedWishlist = await loadWishlist()
      const savedBacklog = await loadBacklog()
      setWishlist(savedWishlist)
      setBacklog(savedBacklog)
    }
    loadData()
  }, [])

  const handleSearch = async () => {
    if (searchTerm.length < 2) return
    setLoading(true)
    const games = await searchGames(searchTerm)
    setResults(games)
    setLoading(false)
  }

  const addToWishlist = async (game) => {
    if (wishlist.some(g => g.id === game.id)) return
    const newWishlist = [...wishlist, game]
    setWishlist(newWishlist)
    await saveWishlist(newWishlist)
  }

  const addToBacklog = async (game) => {
    if (backlog.some(g => g.id === game.id)) return
    const newBacklog = [...backlog, { ...game, status: 'pendiente', note: '', playtime: 0 }]
    setBacklog(newBacklog)
    await saveBacklog(newBacklog)
  }

  const removeFromWishlist = async (gameId) => {
    const newWishlist = wishlist.filter(g => g.id !== gameId)
    setWishlist(newWishlist)
    await saveWishlist(newWishlist)
  }

  const removeFromBacklog = async (gameId) => {
    const newBacklog = backlog.filter(g => g.id !== gameId)
    setBacklog(newBacklog)
    await saveBacklog(newBacklog)
  }

  const changeGameStatus = async (gameId, newStatus) => {
    const game = backlog.find(g => g.id === gameId)
    if (game && game.status !== 'completado' && newStatus === 'completado') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF9800', '#2196F3', '#4CAF50']
      })
    }
    const updatedBacklog = await updateGameStatus(gameId, newStatus, backlog)
    setBacklog(updatedBacklog)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pendiente': return '#FF9800'
      case 'jugando': return '#2196F3'
      case 'completado': return '#4CAF50'
      default: return '#999'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'pendiente': return '⏳ Pendiente'
      case 'jugando': return '🎮 Jugando'
      case 'completado': return '✅ Completado'
      default: return status
    }
  }

  // Exportar datos
  const exportData = () => {
    const data = { wishlist, backlog, exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gametrack-backup-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Importar datos
  const importData = (file) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result)
        setWishlist(data.wishlist || [])
        setBacklog(data.backlog || [])
        await saveWishlist(data.wishlist || [])
        await saveBacklog(data.backlog || [])
        alert('✅ Datos importados correctamente')
      } catch (error) {
        alert('❌ Error al importar: archivo inválido')
      }
    }
    reader.readAsText(file)
  }

  // Ordenar resultados
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
    if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '')
    if (sortBy === 'released') return new Date(b.released || 0) - new Date(a.released || 0)
    return 0
  })

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1a1a1a' : '#f5f5f5',
      color: darkMode ? '#ffffff' : '#000000'
    },
    card: {
      background: darkMode ? 'rgba(45, 45, 45, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
      padding: '15px',
      borderRadius: '16px',
      width: '260px',
      boxShadow: darkMode ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    tabButton: (isActive) => ({
      padding: '12px 20px',
      background: isActive ? (darkMode ? '#FF5722' : '#FF5722') : 'none',
      color: isActive ? 'white' : (darkMode ? '#fff' : '#333'),
      cursor: 'pointer',
      border: 'none',
      borderRadius: '12px',
      fontWeight: isActive ? 'bold' : 'normal',
      transition: 'all 0.2s'
    }),
    input: {
      padding: '12px',
      width: '300px',
      marginRight: '10px',
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#000',
      border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
      borderRadius: '12px',
      fontSize: '14px'
    },
    button: {
      padding: '12px 24px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '12px',
      background: '#FF5722',
      color: 'white',
      fontWeight: 'bold',
      transition: 'transform 0.1s'
    },
    select: {
      padding: '12px',
      marginLeft: '10px',
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#000',
      border: `1px solid ${darkMode ? '#555' : '#ddd'}`,
      borderRadius: '12px',
      cursor: 'pointer'
    }
  }

  return (
    <div style={styles.container}>
      {/* Header con controles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h1 style={{ margin: 0 }}>🎮 GameTrack</h1>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={exportData} style={styles.button}>
            📤 Exportar
          </button>
          <label style={{ ...styles.button, background: '#2196F3', cursor: 'pointer', display: 'inline-block' }}>
            📥 Importar
            <input
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files[0]) importData(e.target.files[0])
                e.target.value = ''
              }}
            />
          </label>
          <button onClick={toggleDarkMode} style={{ ...styles.button, background: darkMode ? '#FF9800' : '#333' }}>
            {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '25px', borderBottom: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`, flexWrap: 'wrap', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('search')} style={styles.tabButton(activeTab === 'search')}>
          🔍 Buscar
        </button>
        <button onClick={() => setActiveTab('wishlist')} style={styles.tabButton(activeTab === 'wishlist')}>
          💖 Wishlist ({wishlist.length})
        </button>
        <button onClick={() => setActiveTab('backlog')} style={styles.tabButton(activeTab === 'backlog')}>
          📋 Backlog ({backlog.length})
        </button>
        <button onClick={() => setActiveTab('stats')} style={styles.tabButton(activeTab === 'stats')}>
          📊 Estadísticas
        </button>
        <button onClick={() => setActiveTab('random')} style={styles.tabButton(activeTab === 'random')}>
          🎲 Random
        </button>
      </div>

      {/* Panel de búsqueda */}
      {activeTab === 'search' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Buscar juego..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>Buscar</button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.select}>
              <option value="rating">⭐ Por rating</option>
              <option value="name">📝 Por nombre</option>
              <option value="released">📅 Por fecha</option>
            </select>
          </div>
          
          {loading ? (
            <SkeletonLoader count={6} />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
              {sortedResults.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onAddToWishlist={addToWishlist}
                  onAddToBacklog={addToBacklog}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Panel de Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          <h2>💖 Tu Wishlist</h2>
          {wishlist.length === 0 && (
            <p style={{ color: darkMode ? '#aaa' : '#666', textAlign: 'center', marginTop: '40px' }}>
              No hay juegos en tu wishlist. Busca y añade algunos.
            </p>
          )}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {wishlist.map(game => (
              <div key={game.id} style={styles.card}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', borderBottom: '2px solid #4CAF50', paddingBottom: '8px' }}>
                  {game.name}
                </h3>
                {game.background_image ? (
                  <img src={game.background_image} alt={game.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }} />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    🎮 Sin imagen
                  </div>
                )}
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff9800' }}>
                  ⭐ {game.rating}/5
                </p>
                <button onClick={() => removeFromWishlist(game.id)} style={{ background: '#f44336', color: 'white', width: '100%', padding: '10px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500' }}>
                  🗑️ Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Panel de Backlog */}
      {activeTab === 'backlog' && (
        <div>
          <h2>📋 Tu Backlog</h2>
          {backlog.length === 0 && (
            <p style={{ color: darkMode ? '#aaa' : '#666', textAlign: 'center', marginTop: '40px' }}>
              No hay juegos en tu backlog. Añade los que quieres jugar.
            </p>
          )}
          
          {backlog.length > 0 && (
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>Filtrar:</span>
              <button onClick={() => setFilterStatus('todos')} style={{ padding: '8px 16px', cursor: 'pointer', background: filterStatus === 'todos' ? '#FF5722' : (darkMode ? '#444' : '#e0e0e0'), color: filterStatus === 'todos' ? 'white' : (darkMode ? '#fff' : '#333'), border: 'none', borderRadius: '20px' }}>
                🔄 Todos ({backlog.length})
              </button>
              <button onClick={() => setFilterStatus('pendiente')} style={{ padding: '8px 16px', cursor: 'pointer', background: filterStatus === 'pendiente' ? '#FF9800' : (darkMode ? '#444' : '#e0e0e0'), color: filterStatus === 'pendiente' ? 'white' : (darkMode ? '#fff' : '#333'), border: 'none', borderRadius: '20px' }}>
                ⏳ Pendiente ({backlog.filter(g => g.status === 'pendiente').length})
              </button>
              <button onClick={() => setFilterStatus('jugando')} style={{ padding: '8px 16px', cursor: 'pointer', background: filterStatus === 'jugando' ? '#2196F3' : (darkMode ? '#444' : '#e0e0e0'), color: filterStatus === 'jugando' ? 'white' : (darkMode ? '#fff' : '#333'), border: 'none', borderRadius: '20px' }}>
                🎮 Jugando ({backlog.filter(g => g.status === 'jugando').length})
              </button>
              <button onClick={() => setFilterStatus('completado')} style={{ padding: '8px 16px', cursor: 'pointer', background: filterStatus === 'completado' ? '#4CAF50' : (darkMode ? '#444' : '#e0e0e0'), color: filterStatus === 'completado' ? 'white' : (darkMode ? '#fff' : '#333'), border: 'none', borderRadius: '20px' }}>
                ✅ Completado ({backlog.filter(g => g.status === 'completado').length})
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {backlog
              .filter(game => filterStatus === 'todos' ? true : game.status === filterStatus)
              .map(game => (
                <div key={game.id} style={{ ...styles.card, border: `2px solid ${getStatusColor(game.status)}` }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <h3 style={{ fontSize: '18px', margin: '0 0 10px 0', borderBottom: `2px solid ${getStatusColor(game.status)}`, paddingBottom: '8px' }}>
                    {game.name}
                  </h3>
                  {game.background_image ? (
                    <img src={game.background_image} alt={game.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px' }} />
                  ) : (
                    <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      🎮 Sin imagen
                    </div>
                  )}
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff9800' }}>⭐ {game.rating}/5</p>
                  
                  <div style={{ display: 'inline-block', marginBottom: '10px', padding: '6px 14px', backgroundColor: getStatusColor(game.status), color: 'white', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>
                    {getStatusText(game.status)}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {game.status !== 'pendiente' && (
                      <button onClick={() => changeGameStatus(game.id, 'pendiente')} style={{ background: '#FF9800', color: 'white', padding: '6px 10px', fontSize: '11px', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
                        ⏳ Pendiente
                      </button>
                    )}
                    {game.status !== 'jugando' && (
                      <button onClick={() => changeGameStatus(game.id, 'jugando')} style={{ background: '#2196F3', color: 'white', padding: '6px 10px', fontSize: '11px', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
                        🎮 Jugando
                      </button>
                    )}
                    {game.status !== 'completado' && (
                      <button onClick={() => changeGameStatus(game.id, 'completado')} style={{ background: '#4CAF50', color: 'white', padding: '6px 10px', fontSize: '11px', border: 'none', borderRadius: '8px', cursor: 'pointer', flex: 1 }}>
                        ✅ Completado
                      </button>
                    )}
                  </div>

                  <button onClick={() => removeFromBacklog(game.id)} style={{ background: '#f44336', color: 'white', width: '100%', marginTop: '10px', padding: '8px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '12px' }}>
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <Statistics backlog={backlog} wishlist={wishlist} />
      )}

      {activeTab === 'random' && (
        <RandomPicker backlog={backlog} />
      )}
    </div>
  )
}

export default App