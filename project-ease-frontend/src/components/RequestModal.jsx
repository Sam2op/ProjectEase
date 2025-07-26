import React, { useState } from 'react'
import { X, DollarSign, CreditCard, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const RequestModal = ({ isOpen, onClose, project }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [paymentOption, setPaymentOption] = useState('advance')
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

  const calculatePaymentAmount = () => {
    if (!project?.price) return 0
    return paymentOption === 'advance' ? Math.round(project.price * 0.7) : project.price
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requestData = {
        projectId: project._id,
        paymentOption,
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
        toast.success('Project request submitted successfully!', { autoClose: 5000 })
        onClose()
        // Reset form
        setPaymentOption('advance')
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

          {/* Payment Options */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Option</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* 70% Advance Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentOption === 'advance' 
                    ? 'border-sky-500 bg-sky-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentOption('advance')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="advance"
                    checked={paymentOption === 'advance'}
                    onChange={(e) => setPaymentOption(e.target.value)}
                    className="text-sky-600"
                  />
                  <CreditCard className="w-5 h-5 text-sky-600" />
                  <span className="font-semibold text-gray-900">70% Advance</span>
                </div>
                <div className="ml-8">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{Math.round(project.price * 0.7).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Pay now: ₹{Math.round(project.price * 0.7).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Remaining: ₹{(project.price - Math.round(project.price * 0.7)).toLocaleString()} (on completion)
                  </p>
                </div>
              </div>

              {/* Full Payment Option */}
              <div 
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  paymentOption === 'full' 
                    ? 'border-sky-500 bg-sky-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentOption('full')}
              >
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="full"
                    checked={paymentOption === 'full'}
                    onChange={(e) => setPaymentOption(e.target.value)}
                    className="text-sky-600"
                  />
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-gray-900">Full Payment</span>
                </div>
                <div className="ml-8">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{project.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Pay once, no remaining amount</p>
                  <p className="text-sm text-green-600 font-medium">✨ Get 5% discount!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Guest Information (if not logged in) */}
          {!user && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
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

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount to pay now:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{calculatePaymentAmount().toLocaleString()}
              </span>
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
                <>
                  <CreditCard className="w-4 h-4" />
                  Request Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RequestModal
