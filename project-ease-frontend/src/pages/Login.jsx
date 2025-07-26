// src/pages/Login.jsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import PasswordInput from '../components/PasswordInput'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const res = await login(data.email, data.password)
    if (res.success) navigate('/dashboard')
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass backdrop-blur-lg p-10 rounded-xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-sky-700">
          Login to ProjectEase
        </h2>
        
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
          rules={{ required: true }}
        />
        
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-sky-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button className="btn-gradient w-full py-2 rounded-lg text-white">
          Sign In
        </button>
      </form>
    </div>
  )
}

export default Login
