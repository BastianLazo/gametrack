// src/components/Statistics.jsx
import { useTheme } from '../context/ThemeContext'

function Statistics({ backlog, wishlist }) {
  const { darkMode } = useTheme()
  const textColor = darkMode ? '#fff' : '#333'
  const cardBg = darkMode ? '#2d2d2d' : '#fff'

  const totalBacklog = backlog.length
  const totalWishlist = wishlist.length
  const completedGames = backlog.filter(g => g.status === 'completado').length
  const completionRate = totalBacklog > 0 ? ((completedGames / totalBacklog) * 100).toFixed(1) : 0

  return (
    <div>
      <h2>📊 Estadísticas</h2>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#FF9800', margin: 0 }}>{totalBacklog}</h3>
          <p style={{ color: textColor }}>Juegos en Backlog</p>
        </div>
        
        <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#4CAF50', margin: 0 }}>{completedGames}</h3>
          <p style={{ color: textColor }}>Juegos Completados</p>
        </div>
        
        <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#2196F3', margin: 0 }}>{completionRate}%</h3>
          <p style={{ color: textColor }}>Tasa de Completado</p>
        </div>
        
        <div style={{ background: cardBg, padding: '20px', borderRadius: '12px', flex: 1, textAlign: 'center' }}>
          <h3 style={{ fontSize: '32px', color: '#9C27B0', margin: 0 }}>{totalWishlist}</h3>
          <p style={{ color: textColor }}>Juegos en Wishlist</p>
        </div>
      </div>

      {totalBacklog === 0 && (
        <p style={{ textAlign: 'center', marginTop: '40px', color: textColor }}>
          Agrega juegos al backlog para ver estadísticas
        </p>
      )}
    </div>
  )
}

export default Statistics