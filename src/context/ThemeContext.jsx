// src/context/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('gametrack_darkmode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    localStorage.setItem('gametrack_darkmode', JSON.stringify(darkMode))
    if (darkMode) {
      document.body.style.backgroundColor = '#1a1a1a'
      document.body.style.color = '#ffffff'
    } else {
      document.body.style.backgroundColor = '#ffffff'
      document.body.style.color = '#000000'
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}