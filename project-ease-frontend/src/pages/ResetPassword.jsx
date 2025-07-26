// src/pages/ResetPassword.jsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Lock } from 'lucide-react'
import PasswordInput from '../components/PasswordInput'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { register, handleSubmit, watch } = useForm()
  const [loading, setLoading] = useState(false)
  
  const password = watch('password')

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await axios.put(`/auth/reset-password/${token}`, {
        password: data.password
      })
      toast.success('Password reset successfully! You can now login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset token')
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
          <Lock className="w-12 h-12 mx-auto text-sky-600 mb-2" />
          <h2 className="text-2xl font-bold text-sky-700">Reset Password</h2>
          <p className="text-gray-600 text-sm mt-1">Enter your new password</p>
        </div>

        <PasswordInput
          register={register}
          name="password"
          label="New Password"
          placeholder="Enter new password"
          rules={{ required: true, minLength: 6 }}
        />

        <PasswordInput
          register={register}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm new password"
          rules={{ 
            required: true,
            validate: value => value === password || 'Passwords do not match'
          }}
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-2 rounded-lg text-white flex items-center justify-center disabled:opacity-50"
        >
          {loading ? (
            <div className="spinner mr-2" />
          ) : (
            <Lock className="w-4 h-4 mr-2" />
          )}
          Reset Password
        </button>
      </form>
    </div>
  )
}

export default ResetPassword
