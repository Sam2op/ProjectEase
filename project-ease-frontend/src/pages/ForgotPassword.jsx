// src/pages/ForgotPassword.jsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Send, ArrowLeft } from 'lucide-react'

const ForgotPassword = () => {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await axios.post('/auth/forgot-password', data)
      toast.success('Reset link sent to your email! Check your inbox.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error sending reset email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass backdrop-blur-lg p-10 rounded-xl shadow-lg w-96 space-y-4"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-sky-700">Forgot Password</h2>
          <p className="text-gray-600 text-sm mt-1">
            Enter your email to receive a reset link
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            {...register('email', { required: true, type: 'email' })}
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-2 rounded-lg text-white flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <div className="spinner mr-2" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          Send Reset Link
        </button>

        <div className="text-center mt-4">
          <Link 
            to="/login" 
            className="text-sm text-sky-600 hover:underline flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
