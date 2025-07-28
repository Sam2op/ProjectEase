import React, { useState } from 'react'
import { X, CreditCard, CheckCircle, DollarSign } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const PaymentModal = ({ isOpen, onClose, request, onPaymentSelected }) => {
  const [paymentOption, setPaymentOption] = useState('advance')
  const [loading, setLoading] = useState(false)

  const calculateAmount = (option) => {
    const price = request.actualPrice || request.estimatedPrice || 0
    return option === 'advance' ? Math.round(price * 0.7) : price
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.put(`/requests/${request._id}/payment-option`, {
        paymentOption
      })

      if (response.data.success) {
        toast.success('Payment option selected! Proceed with payment.', { autoClose: 5000 })
        onPaymentSelected(paymentOption)
        onClose()
      }
    } catch (error) {
      toast.error('Failed to update payment option', { autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !request) return null

  const projectName = request.project?.name || request.customProject?.name

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        <div className="border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Choose Payment Option</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-700 mb-2">🎉 Project Approved!</h3>
            <p className="text-green-600">
              <strong>{projectName}</strong> has been approved for development. 
              Please choose your preferred payment option to proceed.
            </p>
          </div>

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
                  ₹{calculateAmount('advance').toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Pay now: ₹{calculateAmount('advance').toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Remaining: ₹{((request.actualPrice || request.estimatedPrice) - calculateAmount('advance')).toLocaleString()} (on completion)
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
                  ₹{calculateAmount('full').toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Pay once, no remaining amount</p>
                <p className="text-sm text-green-600 font-medium">✨ Get 5% discount!</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount to pay now:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{calculateAmount(paymentOption).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-4">
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
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal
