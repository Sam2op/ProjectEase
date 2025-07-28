import React, { useState } from 'react'
import { X, FileText, Lightbulb, Send } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const CustomProjectModal = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [customProject, setCustomProject] = useState({
    name: '',
    description: '',
    requirements: '',
    category: 'web',
    estimatedBudget: '',
    timeline: ''
  })
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    email: '',
    contactNumber: ''
  })

  const handleCustomProjectChange = (e) => {
    setCustomProject(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

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
      if (!customProject.name || !customProject.description) {
        toast.error('Please fill in all required fields', { autoClose: 5000 })
        return
      }

      const requestData = {
        customProject: {
          ...customProject,
          estimatedPrice: customProject.estimatedBudget ? parseInt(customProject.estimatedBudget) : 0
        },
        clientType: user ? 'registered' : 'guest',
        paymentOption: 'advance' 
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
        toast.success('Custom project request submitted successfully! We\'ll review your requirements and get back to you within 24 hours.', { autoClose: 5000 })
        onClose()
        // Reset form
        setCustomProject({
          name: '',
          description: '',
          requirements: '',
          category: 'web',
          estimatedBudget: '',
          timeline: ''
        })
        setGuestInfo({ name: '', email: '', contactNumber: '' })
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request', { autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Request Custom Project</h2>
            <p className="text-gray-600 mt-1">Tell us about your unique project requirements</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Project Details
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customProject.name}
                  onChange={handleCustomProjectChange}
                  placeholder="e.g., E-commerce Website"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={customProject.category}
                  onChange={handleCustomProjectChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="ai-ml">AI/ML</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget (₹) (Optional)
                </label>
                <input
                  type="number"
                  name="estimatedBudget"
                  value={customProject.estimatedBudget}
                  onChange={handleCustomProjectChange}
                  placeholder="50000"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Timeline (Optional)
                </label>
                <input
                  type="text"
                  name="timeline"
                  value={customProject.timeline}
                  onChange={handleCustomProjectChange}
                  placeholder="e.g., 2-3 months"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="description"
                value={customProject.description}
                onChange={handleCustomProjectChange}
                rows="4"
                placeholder="Describe your project idea, goals, and what you want to achieve..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Requirements (Optional)
              </label>
              <textarea
                name="requirements"
                value={customProject.requirements}
                onChange={handleCustomProjectChange}
                rows="6"
                placeholder="Please provide detailed requirements including:
• Specific features you need
• Target audience
• Preferred technologies (if any)
• Design preferences
• Integration requirements
• Any other specific needs..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              />
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
              <Send className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Our team will review your requirements within 24 hours</li>
                  <li>• We'll provide detailed pricing and timeline estimates</li>
                  <li>• Once approved, you'll choose your payment option</li>
                  <li>• You'll receive regular updates throughout the development process</li>
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
                <>
                  <Send className="w-4 h-4" />
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomProjectModal
