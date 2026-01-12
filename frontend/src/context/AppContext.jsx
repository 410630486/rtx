import React, { createContext, useState, useContext } from 'react'

export const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const showLoading = () => setLoading(true)
  const hideLoading = () => setLoading(false)
  
  const showError = (message) => {
    setError(message)
    setTimeout(() => setError(null), 5000)
  }
  
  const showSuccess = (message) => {
    setSuccess(message)
    setTimeout(() => setSuccess(null), 3000)
  }

  const setAppError = (message) => {
    setError(message)
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AppContext.Provider value={{
      loading,
      setLoading,
      showLoading,
      hideLoading,
      error,
      success,
      setAppError,
      clearError,
      showError,
      showSuccess
    }}>
      {children}
    </AppContext.Provider>
  )
}
