import React, { useState } from 'react'
import { X, DollarSign, Clock, FileText } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RequestModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    contactNumber: ''
  })

  const handleGuestInfoChange = (e) => {
    setGuestInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestData = {
        projectId: project._id,
        clientType: user ? 'registered' : 'guest'
      }

      if (!user) {
        if (!guestInfo.name || !guestInfo.email) {
          toast.error('Please fill in all required guest information', { autoClose: 5000 })
          return
        }
        requestData.guestInfo = guestInfo
      }

      const response = await axios.post('/requests', requestData)

      if (response.data.success) {
        toast.success('Project request submitted successfully! We\'ll review it and get back to you within 24 hours.', { autoClose: 5000 })
        onClose()
        setGuestInfo({ name: '', email: '', contactNumber: '' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request', { autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Request Project</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Info */}
          <div className="bg-sky-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-sky-700 mb-2">{project.name}</h3>
            <p className="text-gray-600 mb-3">{project.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold">₹{project.price?.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{project.duration}</span>
              </span>
            </div>
          </div>

          {/* Guest Information (if not logged in) */}
          {!user && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                Your Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={guestInfo.name}
                    onChange={handleGuestInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={guestInfo.email}
                    onChange={handleGuestInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={guestInfo.contactNumber}
                    onChange={handleGuestInfoChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Our team will review your request within 24 hours</li>
                  <li>• We'll provide detailed pricing and timeline estimates</li>
                  <li>• Once approved, you'll choose your payment option</li>
                  <li>• You'll receive regular updates throughout development</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-gradient text-white px-6 py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestModal
