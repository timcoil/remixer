import '../src/globals.css'
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  // Initialize dark mode class based on localStorage on initial load
  useEffect(() => {
    // Check if dark mode is saved in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    
    // Or check system preference if no localStorage value
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    // Apply dark mode class if needed
    if (isDarkMode || (isDarkMode === null && prefersDark)) {
      document.documentElement.classList.add('dark')
    }
  }, [])
  
  return <Component {...pageProps} />
}

export default MyApp 