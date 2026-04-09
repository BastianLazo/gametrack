// src/components/SkeletonLoader.jsx
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useTheme } from '../context/ThemeContext'

function SkeletonLoader({ count = 6 }) {
  const { darkMode } = useTheme()

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px' }}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} style={{ width: '260px' }}>
          <div style={{ marginBottom: '10px' }}>
            <Skeleton 
              height={150} 
              baseColor={darkMode ? '#3a3a3a' : '#e0e0e0'}
              highlightColor={darkMode ? '#4a4a4a' : '#f5f5f5'}
            />
          </div>
          <Skeleton 
            height={20} 
            width="80%" 
            style={{ marginBottom: '8px' }}
            baseColor={darkMode ? '#3a3a3a' : '#e0e0e0'}
            highlightColor={darkMode ? '#4a4a4a' : '#f5f5f5'}
          />
          <Skeleton 
            height={16} 
            width="60%" 
            style={{ marginBottom: '8px' }}
            baseColor={darkMode ? '#3a3a3a' : '#e0e0e0'}
            highlightColor={darkMode ? '#4a4a4a' : '#f5f5f5'}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Skeleton 
              height={36} 
              width="50%" 
              baseColor={darkMode ? '#3a3a3a' : '#e0e0e0'}
              highlightColor={darkMode ? '#4a4a4a' : '#f5f5f5'}
            />
            <Skeleton 
              height={36} 
              width="50%" 
              baseColor={darkMode ? '#3a3a3a' : '#e0e0e0'}
              highlightColor={darkMode ? '#4a4a4a' : '#f5f5f5'}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default SkeletonLoader