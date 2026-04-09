// src/App.jsx
import { useState, useEffect } from 'react'
import { searchGames } from './services/apiService'
import { saveWishlist, loadWishlist, saveBacklog, loadBacklog, updateGameStatus } from './services/storageService'
import GameCard from './components/GameCard'
import { useTheme } from './context/ThemeContext'

function App() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [wishlist, setWishlist] = useState([])
  const [backlog, setBacklog] = useState([])
  const [activeTab, setActiveTab] = useState('search')
  const [filterStatus, setFilterStatus] = useState('todos')

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
    const newBacklog = [...backlog, { ...game, status: 'pendiente' }]
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

  // Estilos según modo oscuro
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
      color: darkMode ? '#ffffff' : '#000000'
    },
    card: {
      border: `1px solid ${darkMode ? '#444' : '#e0e0e0'}`,
      padding: '15px',
      borderRadius: '12px',
      width: '260px',
      backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
      boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    },
    tabButton: (isActive) => ({
      padding: '10px',
      background: isActive ? (darkMode ? '#555' : '#ddd') : 'none',
      color: darkMode ? '#fff' : '#000',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px'
    }),
    input: {
      padding: '8px',
      width: '300px',
      marginRight: '10px',
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#000',
      border: `1px solid ${darkMode ? '#555' : '#ccc'}`,
      borderRadius: '4px'
    },
    button: {
      padding: '8px 16px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px'
    }
  }

  return (
    <div style={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>🎮 GameTrack</h1>
        <button 
          onClick={toggleDarkMode}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            background: darkMode ? '#ff9800' : '#333',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px'
          }}
        >
          {darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: `1px solid ${darkMode ? '#444' : '#ccc'}` }}>
        <button onClick={() => setActiveTab('search')} style={styles.tabButton(activeTab === 'search')}>
          🔍 Buscar
        </button>
        <button onClick={() => setActiveTab('wishlist')} style={styles.tabButton(activeTab === 'wishlist')}>
          💖 Wishlist ({wishlist.length})
        </button>
        <button onClick={() => setActiveTab('backlog')} style={styles.tabButton(activeTab === 'backlog')}>
          📋 Backlog ({backlog.length})
        </button>
      </div>

      {activeTab === 'search' && (
        <div>
          <div>
            <input
              type="text"
              placeholder="Buscar juego..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={styles.input}
            />
            <button onClick={handleSearch} style={styles.button}>Buscar</button>
          </div>
          {loading && <p>Cargando...</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {results.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onAddToWishlist={addToWishlist}
                onAddToBacklog={addToBacklog}
              />
            ))}
          </div>
        </div>
      )}

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
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <h3 style={{ 
                  fontSize: '18px', 
                  margin: '0 0 10px 0', 
                  borderBottom: '2px solid #4CAF50',
                  paddingBottom: '8px'
                }}>
                  {game.name}
                </h3>
                {game.background_image ? (
                  <img 
                    src={game.background_image} 
                    alt={game.name} 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                    🎮 Sin imagen
                  </div>
                )}
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff9800' }}>
                  ⭐ {game.rating}/5
                </p>
                <button 
                  onClick={() => removeFromWishlist(game.id)} 
                  style={{ 
                    background: '#f44336', 
                    color: 'white', 
                    width: '100%',
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}
                >
                  🗑️ Eliminar de Wishlist
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <span style={{ fontWeight: 'bold' }}>Filtrar por estado:</span>
              <button 
                onClick={() => setFilterStatus('todos')}
                style={{ 
                  padding: '5px 12px', 
                  cursor: 'pointer',
                  background: filterStatus === 'todos' ? (darkMode ? '#555' : '#333') : (darkMode ? '#444' : '#e0e0e0'),
                  color: filterStatus === 'todos' ? 'white' : (darkMode ? '#fff' : '#333'),
                  border: 'none',
                  borderRadius: '4px'
                }}>
                🔄 Todos ({backlog.length})
              </button>
              <button 
                onClick={() => setFilterStatus('pendiente')}
                style={{ 
                  padding: '5px 12px', 
                  cursor: 'pointer',
                  background: filterStatus === 'pendiente' ? '#FF9800' : (darkMode ? '#444' : '#e0e0e0'),
                  color: filterStatus === 'pendiente' ? 'white' : (darkMode ? '#fff' : '#333'),
                  border: 'none',
                  borderRadius: '4px'
                }}>
                ⏳ Pendiente ({backlog.filter(g => g.status === 'pendiente').length})
              </button>
              <button 
                onClick={() => setFilterStatus('jugando')}
                style={{ 
                  padding: '5px 12px', 
                  cursor: 'pointer',
                  background: filterStatus === 'jugando' ? '#2196F3' : (darkMode ? '#444' : '#e0e0e0'),
                  color: filterStatus === 'jugando' ? 'white' : (darkMode ? '#fff' : '#333'),
                  border: 'none',
                  borderRadius: '4px'
                }}>
                🎮 Jugando ({backlog.filter(g => g.status === 'jugando').length})
              </button>
              <button 
                onClick={() => setFilterStatus('completado')}
                style={{ 
                  padding: '5px 12px', 
                  cursor: 'pointer',
                  background: filterStatus === 'completado' ? '#4CAF50' : (darkMode ? '#444' : '#e0e0e0'),
                  color: filterStatus === 'completado' ? 'white' : (darkMode ? '#fff' : '#333'),
                  border: 'none',
                  borderRadius: '4px'
                }}>
                ✅ Completado ({backlog.filter(g => g.status === 'completado').length})
              </button>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
            {backlog
              .filter(game => filterStatus === 'todos' ? true : game.status === filterStatus)
              .map(game => (
                <div key={game.id} style={{ 
                  ...styles.card,
                  border: `2px solid ${getStatusColor(game.status)}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    margin: '0 0 10px 0', 
                    borderBottom: `2px solid ${getStatusColor(game.status)}`,
                    paddingBottom: '8px'
                  }}>
                    {game.name}
                  </h3>
                  {game.background_image ? (
                    <img 
                      src={game.background_image} 
                      alt={game.name} 
                      style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '150px', backgroundColor: '#e0e0e0', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                      🎮 Sin imagen
                    </div>
                  )}
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff9800' }}>
                    ⭐ {game.rating}/5
                  </p>
                  
                  <div style={{ 
                    display: 'inline-block',
                    marginBottom: '10px',
                    padding: '4px 8px',
                    backgroundColor: getStatusColor(game.status),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {getStatusText(game.status)}
                  </div>

                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {game.status !== 'pendiente' && (
                      <button 
                        onClick={() => changeGameStatus(game.id, 'pendiente')}
                        style={{ 
                          background: '#FF9800', 
                          color: 'white', 
                          padding: '5px 8px',
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                        ⏳ Pendiente
                      </button>
                    )}
                    {game.status !== 'jugando' && (
                      <button 
                        onClick={() => changeGameStatus(game.id, 'jugando')}
                        style={{ 
                          background: '#2196F3', 
                          color: 'white', 
                          padding: '5px 8px',
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                        🎮 Jugando
                      </button>
                    )}
                    {game.status !== 'completado' && (
                      <button 
                        onClick={() => changeGameStatus(game.id, 'completado')}
                        style={{ 
                          background: '#4CAF50', 
                          color: 'white', 
                          padding: '5px 8px',
                          fontSize: '11px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          flex: 1
                        }}>
                        ✅ Completado
                      </button>
                    )}
                  </div>

                  <button 
                    onClick={() => removeFromBacklog(game.id)} 
                    style={{ 
                      background: '#f44336', 
                      color: 'white', 
                      width: '100%',
                      marginTop: '10px',
                      padding: '8px',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      fontSize: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}
                  >
                    🗑️ Eliminar de Backlog
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App