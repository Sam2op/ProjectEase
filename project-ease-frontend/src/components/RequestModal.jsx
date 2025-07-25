import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const RequestModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth()
  const [guest, setGuest] = useState({ name: '', email: '', contact: '' })
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const payload = user
      ? {
          type: 'existing',
          project: project._id
        }
      : {
          type: 'existing',
          project: project._id,
          clientType: 'guest',
          guestInfo: guest
        }

    try {
      await axios.post('/requests', payload)
      toast.success('Request submitted!')
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl w-96 p-6 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        <h2 className="text-lg font-semibold text-sky-700 mb-4">
          Request: {project.name}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!user && (
            <>
              <input
                type="text"
                placeholder="Your name"
                className="w-full border rounded-lg px-3 py-2"
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border rounded-lg px-3 py-2"
                value={guest.email}
                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Contact number"
                className="w-full border rounded-lg px-3 py-2"
                value={guest.contact}
                onChange={(e) => setGuest({ ...guest, contact: e.target.value })}
                required
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient text-white w-full py-2 rounded-lg flex justify-center"
          >
            {loading ? <span className="spinner" /> : 'Submit Request'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default RequestModal
