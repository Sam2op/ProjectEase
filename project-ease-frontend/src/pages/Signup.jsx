import React from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const { register, handleSubmit } = useForm()
  const { signup } = useAuth()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    const res = await signup(data)
     if (res.success) {
   toast.info('Check your inbox for a verification link')
   navigate('/dashboard')
 }
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
        <input
          {...register('password', { required: true })}
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg px-3 py-2"
        />
        <button className="btn-gradient w-full py-2 rounded-lg text-white">
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default Signup
