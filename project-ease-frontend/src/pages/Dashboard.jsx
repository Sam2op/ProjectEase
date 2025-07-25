import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Search, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectDetailsModal from '../components/ProjectDetailsModal'
import { Navigate } from 'react-router-dom'

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700'
}

const Dashboard = () => {
  const { user } = useAuth()

  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState('')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const fetchMyRequests = async () => {
      try {
        const { data } = await axios.get('/requests/my')
        if (!cancelled) {
          setRequests(data.requests)
        }
      } catch (err) {
        if (!cancelled) {
          toast.error('Failed to load your projects')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMyRequests()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return requests.filter(r => {
      const projectName = (r.project?.name || r.customProject?.name || '').toLowerCase()
      return projectName.includes(query.toLowerCase())
    })
  }, [query, requests])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'approved':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <AlertCircle className="w-4 h-4" />
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-64">
          <div className="spinner w-8 h-8" />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-sky-700 mb-2">My Projects</h2>
        <p className="text-gray-600">Track your project progress and make payments</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 w-full md:w-96">
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {requests.length === 0 ? 'No projects yet' : 'No projects found'}
          </h3>
          <p className="text-gray-500">
            {requests.length === 0 
              ? 'Start by requesting a project from our catalog'
              : 'Try adjusting your search terms'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filtered.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Project Info */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-sky-700">
                        {request.project?.name || request.customProject?.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {request.project?.description || request.customProject?.description}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusColor[request.status]}`}>
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>

                  {/* Progress Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {request.currentModule && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-700">Current Module</p>
                        <p className="text-blue-600 text-sm">{request.currentModule}</p>
                      </div>
                    )}
                    
                    {(request.actualPrice || request.estimatedPrice) && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-700">Price</p>
                        <p className="text-green-600 font-semibold">₹{request.actualPrice || request.estimatedPrice}</p>
                      </div>
                    )}
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-700">Payment Status</p>
                      <p className={`text-sm font-medium ${
                        request.paymentStatus === 'completed' 
                          ? 'text-green-600'
                          : request.paymentStatus === 'partial'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }`}>
                        {request.paymentStatus.charAt(0).toUpperCase() + request.paymentStatus.slice(1)}
                      </p>
                    </div>
                  </div>

                  {/* Admin Notes */}
                  {request.adminNotes && (
                    <div className="bg-sky-50 border-l-4 border-sky-500 p-3 mb-4">
                      <p className="text-sm font-medium text-sky-700">Latest Update</p>
                      <p className="text-sky-600 text-sm">{request.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  {request.githubLink && (
                    <a
                      href={request.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />
    </div>
  )
}

export default Dashboard
