// src/components/GameCard.jsx
import { useState, useEffect } from 'react'
import { getGameDeals, formatPrice } from '../services/cheapsharkService'

function GameCard({ game, onAddToWishlist, onAddToBacklog }) {
  const [addedWish, setAddedWish] = useState(false)
  const [addedBacklog, setAddedBacklog] = useState(false)
  const [deals, setDeals] = useState([])
  const [loadingDeals, setLoadingDeals] = useState(false)
  const [showDeals, setShowDeals] = useState(false)

  // Mapeo de IDs de tiendas a nombres y colores
  const getStoreInfo = (storeID) => {
    const stores = {
      '1': { name: 'Steam', color: '#171a21', bg: '#66c0f4' },
      '2': { name: 'GOG', color: '#3b1e0a', bg: '#e8a345' },
      '3': { name: 'Origin', color: '#1a472a', bg: '#f26522' },
      '4': { name: 'Uplay', color: '#1a1a1a', bg: '#00a3e0' },
      '5': { name: 'Epic', color: '#2c2c2c', bg: '#ffffff' },
      '7': { name: 'Xbox', color: '#107c10', bg: '#e5e5e5' },
      '8': { name: 'PlayStation', color: '#003791', bg: '#ffffff' },
      '11': { name: 'Nintendo', color: '#e60012', bg: '#ffffff' }
    }
    return stores[storeID] || { name: 'Otra tienda', color: '#666', bg: '#f0f0f0' }
  }

  // Buscar ofertas al montar el componente
  useEffect(() => {
    const fetchDeals = async () => {
      setLoadingDeals(true)
      const results = await getGameDeals(game.name)
      setDeals(results.slice(0, 3))
      setLoadingDeals(false)
    }
    fetchDeals()
  }, [game.name])

  const handleWishlist = () => {
    onAddToWishlist(game)
    setAddedWish(true)
    setTimeout(() => setAddedWish(false), 1500)
  }

  const handleBacklog = () => {
    onAddToBacklog(game)
    setAddedBacklog(true)
    setTimeout(() => setAddedBacklog(false), 1500)
  }

  return (
    <div style={{ 
      border: '1px solid #e0e0e0', 
      margin: '10px', 
      padding: '15px', 
      borderRadius: '12px',
      width: '260px',
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      
      {/* Nombre del juego */}
      <h3 style={{ 
        fontSize: '18px', 
        margin: '0 0 10px 0', 
        color: '#333',
        fontWeight: '600',
        borderBottom: '2px solid #4CAF50',
        paddingBottom: '8px'
      }}>
        {game.name}
      </h3>
      
      {/* Imagen */}
      {game.background_image ? (
        <img 
          src={game.background_image} 
          alt={game.name} 
          style={{ 
            width: '100%', 
            height: '150px',
            objectFit: 'cover',
            borderRadius: '8px', 
            marginBottom: '10px',
            backgroundColor: '#f5f5f5'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '150px',
          backgroundColor: '#e0e0e0',
          borderRadius: '8px',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }}>
          🎮 Sin imagen
        </div>
      )}
      
      {/* Rating */}
      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#ff9800' }}>
        {'⭐'.repeat(Math.floor(game.rating))} {game.rating}/5
      </p>
      
      {/* Botón de ofertas */}
      <button 
        onClick={() => setShowDeals(!showDeals)} 
        style={{ 
          background: showDeals ? '#e65100' : '#FF9800', 
          color: 'white', 
          width: '100%',
          marginBottom: '10px',
          padding: '10px',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500',
          fontSize: '14px',
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = showDeals ? '#bf360c' : '#f57c00'}
        onMouseLeave={(e) => e.currentTarget.style.background = showDeals ? '#e65100' : '#FF9800'}
      >
        🏷️ {showDeals ? 'Ocultar ofertas' : `Ver ofertas (${deals.length})`}
      </button>

      {/* Mostrar ofertas */}
      {showDeals && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '8px',
          fontSize: '13px',
          maxHeight: '250px',
          overflowY: 'auto'
        }}>
          {loadingDeals && (
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <span>🔍 Buscando ofertas...</span>
            </div>
          )}
          {!loadingDeals && deals.length === 0 && (
            <div style={{ textAlign: 'center', padding: '10px', color: '#999' }}>
              <span>📭 No hay ofertas disponibles</span>
            </div>
          )}
          {deals.map((deal, index) => {
            const store = getStoreInfo(deal.storeID)
            return (
              <div key={index} style={{ 
                marginBottom: '10px', 
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e0e0e0'
              }}>
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '12px', color: '#666' }}>
                  {deal.title}
                </p>
                <p style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold', color: '#4CAF50' }}>
                  💰 {formatPrice(deal.salePrice)}
                  {deal.normalPrice && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#999', 
                      textDecoration: 'line-through',
                      marginLeft: '8px'
                    }}>
                      {formatPrice(deal.normalPrice)}
                    </span>
                  )}
                </p>
                <div style={{ 
                  display: 'inline-block',
                  padding: '2px 8px',
                  backgroundColor: store.bg,
                  color: store.color,
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '500'
                }}>
                  🏪 {store.name}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button 
          onClick={handleWishlist} 
          style={{ 
            background: addedWish ? '#4CAF50' : '#2196F3', 
            color: 'white', 
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!addedWish) e.currentTarget.style.background = '#1976D2'
          }}
          onMouseLeave={(e) => {
            if (!addedWish) e.currentTarget.style.background = '#2196F3'
          }}
        >
          {addedWish ? '✓ Añadido' : '💖 Wishlist'}
        </button>
        <button 
          onClick={handleBacklog} 
          style={{ 
            background: addedBacklog ? '#4CAF50' : '#FF5722', 
            color: 'white', 
            flex: 1,
            padding: '10px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!addedBacklog) e.currentTarget.style.background = '#E64A19'
          }}
          onMouseLeave={(e) => {
            if (!addedBacklog) e.currentTarget.style.background = '#FF5722'
          }}
        >
          {addedBacklog ? '✓ Añadido' : '📋 Backlog'}
        </button>
      </div>
    </div>
  )
}

export default GameCard