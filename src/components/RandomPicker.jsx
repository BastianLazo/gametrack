// src/components/RandomPicker.jsx
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function RandomPicker({ backlog }) {
  const [selectedGame, setSelectedGame] = useState(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const { darkMode } = useTheme()

  const pickRandomGame = () => {
    if (backlog.length === 0) return
    
    setIsSpinning(true)
    
    // Animación de ruleta: cambia rápidamente entre juegos
    let spins = 0
    const maxSpins = 20
    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * backlog.length)
      setSelectedGame(backlog[randomIndex])
      spins++
      
      if (spins >= maxSpins) {
        clearInterval(spinInterval)
        setIsSpinning(false)
      }
    }, 80)
  }

  const getStatusEmoji = (status) => {
    switch(status) {
      case 'pendiente': return '⏳'
      case 'jugando': return '🎮'
      case 'completado': return '✅'
      default: return '📋'
    }
  }

  const getStatusText = (status) => {
    switch(status) {
      case 'pendiente': return 'Pendiente'
      case 'jugando': return 'Jugando'
      case 'completado': return 'Completado'
      default: return status
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'pendiente': return '#FF9800'
      case 'jugando': return '#2196F3'
      case 'completado': return '#4CAF50'
      default: return '#999'
    }
  }

  const textColor = darkMode ? '#fff' : '#333'
  const cardBg = darkMode ? '#2d2d2d' : '#fff'

  return (
    <div>
      <h2>🎲 ¿No sabes qué jugar?</h2>
      
      <button
        onClick={pickRandomGame}
        disabled={backlog.length === 0 || isSpinning}
        style={{
          padding: '15px 30px',
          fontSize: '18px',
          fontWeight: 'bold',
          background: isSpinning ? '#999' : '#FF5722',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          cursor: backlog.length === 0 ? 'not-allowed' : 'pointer',
          marginBottom: '30px',
          transition: 'transform 0.2s, background 0.2s',
          boxShadow: isSpinning ? 'none' : '0 4px 15px rgba(255,87,34,0.3)'
        }}
        onMouseEnter={(e) => {
          if (!isSpinning && backlog.length > 0) {
            e.currentTarget.style.transform = 'scale(1.05)'
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {isSpinning ? '🎲 ¡Girando...!' : '🎲 ¡Elige un juego por mí!'}
      </button>

      {selectedGame && (
        <div
          key={selectedGame.id}
          style={{
            background: cardBg,
            padding: '25px',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: darkMode ? '0 8px 20px rgba(0,0,0,0.3)' : '0 8px 20px rgba(0,0,0,0.1)',
            animation: isSpinning ? 'shake 0.1s infinite' : 'fadeInUp 0.5s ease-out',
            border: `2px solid ${getStatusColor(selectedGame.status)}`
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '10px', animation: isSpinning ? 'spin 0.2s infinite' : 'none' }}>
            {getStatusEmoji(selectedGame.status)}
          </div>
          
          <h3 style={{ 
            color: textColor, 
            fontSize: '28px', 
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            {selectedGame.name}
          </h3>
          
          {selectedGame.background_image && (
            <img 
              src={selectedGame.background_image} 
              alt={selectedGame.name}
              style={{ 
                width: '200px', 
                borderRadius: '12px', 
                marginBottom: '15px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            />
          )}
          
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            ⭐ {selectedGame.rating}/5
          </p>
          
          <div style={{
            display: 'inline-block',
            padding: '8px 20px',
            borderRadius: '25px',
            background: getStatusColor(selectedGame.status),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {getStatusText(selectedGame.status)}
          </div>
        </div>
      )}

      {backlog.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          background: cardBg,
          borderRadius: '16px',
          color: textColor
        }}>
          <p style={{ fontSize: '48px', margin: 0 }}>📭</p>
          <p style={{ fontSize: '18px' }}>Agrega juegos a tu backlog para usar el random picker</p>
          <p style={{ fontSize: '14px', opacity: 0.7 }}>Ve a la pestaña Buscar → Añade juegos a Backlog</p>
        </div>
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
            100% { transform: translateX(0); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default RandomPicker