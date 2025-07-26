import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'
import { CheckCircle } from 'lucide-react'

const Signup = () => {
  const { register, handleSubmit } = useForm()
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [emailSent, setEmailSent] = useState(false)

  const onSubmit = async (data) => {
    const res = await signup(data)
    if (res.success) {
      setEmailSent(true)
    }
  }

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-10 rounded-xl shadow-lg w-96 text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sky-700">Check Your Email!</h2>
          <p className="text-gray-600">
            We've sent a verification link to your email address. 
            Please click the link to verify your account and complete the registration.
          </p>
          <div className="text-center mt-6">
            <Link to="/login" className="text-sky-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass p-10 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-sky-700 mb-2">
          Create Your Account
        </h2>
        
        <input
          {...register('username', { required: true })}
          placeholder="Username"
          className="w-full border rounded-lg px-3 py-2"
        />
        
        <input
          {...register('email', { required: true })}
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg px-3 py-2"
        />
        
        <PasswordInput
          register={register}
          name="password"
          placeholder="Password"
          rules={{ required: true, minLength: 6 }}
        />
        
        <button className="btn-gradient w-full py-2 rounded-lg text-white">
          Sign Up
        </button>
        
        <div className="text-center">
          <Link to="/login" className="text-sm text-sky-600 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signup
