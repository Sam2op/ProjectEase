import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

export default function VerifyEmail() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/auth/verify-email/${token}`)
        if (data.success) {
          toast.success('Verification successful! You may now log in.', {
            autoClose: 5000,
            toastId: 'verify-success'
          })
          navigate('/login', { replace: true })
        } else {
          throw new Error(data.message || 'Verification failed')
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Verification failed. Invalid or expired link.', {
          autoClose: 8000,
          toastId: 'verify-failed'
        })
        navigate('/signup', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [token, navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  return null
}
