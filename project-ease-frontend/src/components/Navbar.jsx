import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMenuOpen(false)
  }

  const navItems = user ? [
    { name: 'Home', action: () => scrollToSection('home') },
    { name: 'Projects', action: () => scrollToSection('projects') },
    {
      name: 'Dashboard',
      path: user.role === 'admin' ? '/admin' : '/dashboard'
    }
  ] : [
    { name: 'Home', action: () => scrollToSection('home') },
    { name: 'Projects', action: () => scrollToSection('projects') },
    { name: 'About Us', action: () => scrollToSection('about') },
    { name: 'Reach Us', action: () => scrollToSection('contact') }
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-sky-200/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
              ProjectEase
            </span>
            <span className="text-xs text-gray-600 -mt-1">CodeSalah - Build Fast, Submit Faster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action || (() => navigate(item.path))}
                className="text-gray-700 hover:text-sky-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}

            {/* Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-sky-50 hover:bg-sky-100 rounded-lg px-3 py-2 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </button>

                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                  >
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsProfileOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-sky-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-sky-600 hover:to-blue-700 transition-all duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden py-4 border-t border-gray-200"
          >
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action || (() => navigate(item.path))}
                className="block w-full text-left py-2 text-gray-700 hover:text-sky-600"
              >
                {item.name}
              </button>
            ))}
            
            {user ? (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{user.username}</span>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="block py-2 text-gray-700 hover:text-sky-600">
                    Admin Panel
                  </Link>
                )}
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-sky-600">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-sky-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
                <Link
                  to="/login"
                  className="block py-2 text-gray-700 hover:text-sky-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 text-gray-700 hover:text-sky-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
