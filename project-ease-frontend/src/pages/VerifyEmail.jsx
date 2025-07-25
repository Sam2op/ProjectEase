import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const VerifyEmail = () => {
  const { token } = useParams()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    axios.get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  if (status === 'verifying') return (
    <p className="text-center mt-20">Verifying your e-mail…</p>
  )

  return (
    <div className="flex flex-col items-center mt-20">
      {status === 'success' ? (
        <>
          <h2 className="text-2xl font-bold text-green-600 mb-4">
            E-mail verified successfully!
          </h2>
          <Link to="/login" className="btn-gradient text-white px-6 py-2 rounded-lg">
            Sign In
          </Link>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Verification link invalid or expired.
          </h2>
          <Link to="/signup" className="underline text-sky-600">
            Create a new account
          </Link>
        </>
      )}
    </div>
  )
}

export default VerifyEmail
