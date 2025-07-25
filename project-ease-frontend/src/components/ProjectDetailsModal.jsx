import React, { useState } from 'react'
import { X, ExternalLink, Github, Clock, CheckCircle, AlertCircle, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import axios from 'axios'

const ProjectDetailsModal = ({ open, onClose, request }) => {
  const [loading, setLoading] = useState(false)

  if (!open || !request) return null

  const handlePayment = async (paymentType = 'full') => {
    setLoading(true)
    try {
      const amount = paymentType === 'advance' 
        ? Math.round((request.actualPrice || request.estimatedPrice) * 0.7)
        : (request.actualPrice || request.estimatedPrice)

      const { data: { order } } = await axios.post('/payments/create-order', {
        requestId: request._id,
        amount,
        paymentType
      })

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ProjectEase',
        description: `Payment for ${request.project?.name || request.customProject?.name}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post('/payments/verify', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature
            })
            toast.success('Payment successful!')
            onClose()
            window.location.reload()
          } catch (err) {
            toast.error('Payment verification failed')
          }
        },
        prefill: {
          name: request.user?.username || request.guestInfo?.name,
          email: request.user?.email || request.guestInfo?.email,
          contact: request.user?.contactNumber || request.guestInfo?.contact
        },
        theme: {
          color: '#0ea5e9'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      toast.error('Failed to create payment order')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      approved: 'text-green-600 bg-green-100',
      'in-progress': 'text-blue-600 bg-blue-100',
      completed: 'text-sky-600 bg-sky-100',
      rejected: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const projectName = request.project?.name || request.customProject?.name
  const projectDescription = request.project?.description || request.customProject?.description
  const projectPrice = request.actualPrice || request.estimatedPrice || 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{projectName}</h2>
              <p className="text-sky-100 mt-1">Project Details & Progress</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-sky-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Price</h3>
              <p className="text-2xl font-bold text-green-600">₹{projectPrice}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Payment Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                request.paymentStatus === 'completed' 
                  ? 'text-green-600 bg-green-100'
                  : request.paymentStatus === 'partial'
                  ? 'text-yellow-600 bg-yellow-100'
                  : 'text-red-600 bg-red-100'
              }`}>
                {request.paymentStatus}
              </span>
            </div>
          </div>

          {/* Project Description */}
          {projectDescription && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{projectDescription}</p>
            </div>
          )}

          {/* Technologies */}
          {(request.project?.technologies || request.customProject?.technologies) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {(request.project?.technologies || request.customProject?.technologies).map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Current Progress */}
          {request.currentModule && (
            <div className="bg-sky-50 rounded-lg p-4 border-l-4 border-sky-500">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-sky-600" />
                <h3 className="font-semibold text-sky-700">Currently Working On</h3>
              </div>
              <p className="text-sky-600">{request.currentModule}</p>
            </div>
          )}

          {/* Admin Notes */}
          {request.adminNotes && (
            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-700">Admin Notes</h3>
              </div>
              <p className="text-blue-600">{request.adminNotes}</p>
            </div>
          )}

          {/* Status History */}
          {request.statusHistory && request.statusHistory.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-4">Progress Timeline</h3>
              <div className="space-y-3">
                {request.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700 capitalize">{history.status}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(history.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                      )}
                      {history.updatedBy && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by: {history.updatedBy.username}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Link */}
          {request.githubLink && (
            <div className="flex items-center justify-center">
              <a
                href={request.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Payment Buttons */}
          {request.status === 'approved' && request.paymentStatus !== 'completed' && (
            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Options
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handlePayment('advance')}
                  disabled={loading}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Pay 70% Advance (₹{Math.round(projectPrice * 0.7)})
                </button>
                <button
                  onClick={() => handlePayment('full')}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Pay Full Amount (₹{projectPrice})
                </button>
              </div>
              <p className="text-sm text-green-700 mt-3">
                Choose to pay 70% advance now and 30% on completion, or pay the full amount upfront.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProjectDetailsModal
