// src/components/RandomPicker.jsx
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function RandomPicker({ backlog }) {
  const [selectedGame, setSelectedGame] = useState(null)
  const { darkMode } = useTheme()
  const textColor = darkMode ? '#fff' : '#333'
  const cardBg = darkMode ? '#2d2d2d' : '#fff'

  const pickRandomGame = () => {
    if (backlog.length === 0) return
    const randomIndex = Math.floor(Math.random() * backlog.length)
    setSelectedGame(backlog[randomIndex])
  }

  return (
    <div>
      <h2>🎲 ¿No sabes qué jugar?</h2>
      
      <button
        onClick={pickRandomGame}
        disabled={backlog.length === 0}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          background: backlog.length === 0 ? '#999' : '#FF5722',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: backlog.length === 0 ? 'not-allowed' : 'pointer',
          marginBottom: '30px'
        }}
      >
        🎲 ¡Elige un juego por mí!
      </button>

      {selectedGame && (
        <div style={{
          background: cardBg,
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: textColor, fontSize: '24px' }}>
            {selectedGame.name}
          </h3>
          {selectedGame.background_image && (
            <img 
              src={selectedGame.background_image} 
              alt={selectedGame.name}
              style={{ width: '200px', borderRadius: '8px' }}
            />
          )}
          <p>⭐ {selectedGame.rating}/5</p>
        </div>
      )}

      {backlog.length === 0 && (
        <p style={{ color: textColor, textAlign: 'center' }}>
          📭 Agrega juegos a tu backlog (pendiente o jugando)
        </p>
      )}
    </div>
  )
}

export default RandomPicker