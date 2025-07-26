import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { CheckCircle, XCircle } from 'lucide-react'

const VerifyEmail = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setAuthState } = useAuth() // You'll need to add this method
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify-email/${token}`)
        
        // Auto-login user after verification
        const { token: authToken, user } = response.data
        localStorage.setItem('token', authToken)
        localStorage.setItem('user', JSON.stringify(user))
        
        setStatus('success')
        toast.success('Email verified successfully! Welcome to ProjectEase!')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } catch (err) {
        setStatus('error')
        toast.error('Email verification failed')
      }
    }

    verifyEmail()
  }, [token, navigate])

  if (status === 'verifying') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-4" />
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass p-10 rounded-xl shadow-lg w-96 text-center space-y-4">
        {status === 'success' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-600">Email Verified!</h2>
            <p className="text-gray-600">
              Your email has been successfully verified. You're being redirected to your dashboard...
            </p>
          </>
        ) : (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-600">
              The verification link is invalid or has expired.
            </p>
            <button 
              onClick={() => navigate('/signup')}
              className="btn-gradient text-white px-6 py-2 rounded-lg"
            >
              Sign Up Again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
