import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Set up axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL

// Add axios interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling - FIXED
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401s for token expiration, not login failures
    if (error.response?.status === 401) {
      const msg = error.response.data?.message || 'Session expired'
      
      // Only redirect if we're not already on auth pages
      if (!['/login', '/signup', '/forgot-password'].includes(window.location.pathname)) {
        toast.error('Session expired. Please login again.', { 
          autoClose: 5000,
          toastId: 'session-expired' // Prevent duplicate toasts
        })
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsAuthenticated(true)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email, password) => {
    // Clear any existing toasts first
    toast.dismiss()
    
    try {
      const response = await axios.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { token, user } = response.data
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        setUser(user)
        setIsAuthenticated(true)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        // Success toast with custom duration
        toast.success(`Welcome back, ${user.username}!`, {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: 'login-success'
        })
        
        return { success: true }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      
      // Error toast with longer duration for readability
      toast.error(message, {
        autoClose: 6000, // 6 seconds for error messages
        closeOnClick: true,
        pauseOnHover: true,
        hideProgressBar: false,
        toastId: 'login-error'
      })
      
      return { success: false, message }
    }
  }

  const signup = async (userData) => {
    // Clear any existing toasts first
    toast.dismiss()
    
    try {
      const response = await axios.post('/auth/signup', userData)
      
      if (response.data.success) {
        toast.success('Check your email for verification link!', {
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
          toastId: 'signup-success'
        })
        return { success: true, message: response.data.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      
      toast.error(message, {
        autoClose: 6000,
        closeOnClick: true,
        pauseOnHover: true,
        toastId: 'signup-error'
      })
      
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setIsAuthenticated(false)
    delete axios.defaults.headers.common['Authorization']
    
    toast.success('Logged out successfully', {
      autoClose: 3000,
      toastId: 'logout-success'
    })

    // Force redirect to login page
    navigate('/login', { replace: true })
  }

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
