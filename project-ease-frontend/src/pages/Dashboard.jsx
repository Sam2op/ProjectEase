import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { Search, Eye, Clock, CheckCircle, AlertCircle, Filter, Monitor, Smartphone, Brain, Code, Star, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import ProjectDetailsModal from '../components/ProjectDetailsModal'
import RequestModal from '../components/RequestModal'
import { Navigate, Link } from 'react-router-dom'
import CustomProjectModal from '../components/CustomProjectModal'
import { Plus } from 'lucide-react'


const statusColor = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-sky-100 text-sky-700',
  rejected: 'bg-red-100 text-red-700'
}

const categoryIcons = {
  web: Monitor,
  mobile: Smartphone,
  desktop: Monitor,
  'ai-ml': Brain,
  other: Code
}

const Dashboard = () => {
  const { user } = useAuth()

  // Redirect admins to admin dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  const [myRequests, setMyRequests] = useState([])
  const [allProjects, setAllProjects] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('my-projects') // 'my-projects' or 'all-projects'
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showCustomProjectModal, setShowCustomProjectModal] = useState(false)

  // Fetch user's requests
  useEffect(() => {
    let cancelled = false

    const fetchMyRequests = async () => {
      try {
        const { data } = await axios.get('/requests/my')
        if (!cancelled) {
          setMyRequests(data.requests)
        }
      } catch (err) {
        if (!cancelled) {
          toast.error('Failed to load your projects', { autoClose: 5000 })
        }
      }
    }

    fetchMyRequests()
    return () => { cancelled = true }
  }, [])

  // Fetch all projects when filter is changed to 'all-projects'
  useEffect(() => {
    let cancelled = false

    const fetchAllProjects = async () => {
      if (filter === 'all-projects') {
        try {
          const { data } = await axios.get('/projects')
          if (!cancelled) {
            setAllProjects(data.projects)
          }
        } catch (err) {
          if (!cancelled) {
            toast.error('Failed to load projects', { autoClose: 5000 })
          }
        } finally {
          if (!cancelled) {
            setLoading(false)
          }
        }
      } else {
        setLoading(false)
      }
    }

    fetchAllProjects()
    return () => { cancelled = true }
  }, [filter])

  const filteredData = useMemo(() => {
    if (filter === 'my-projects') {
      return myRequests.filter(r => {
        const projectName = (r.project?.name || r.customProject?.name || '').toLowerCase()
        return projectName.includes(query.toLowerCase())
      })
    } else {
      return allProjects.filter(p => {
        const projectName = p.name.toLowerCase()
        return projectName.includes(query.toLowerCase())
      })
    }
  }, [query, myRequests, allProjects, filter])

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
        <h2 className="text-3xl font-bold text-sky-700 mb-2">
          {filter === 'my-projects' ? 'My Projects' : 'All Projects'}
        </h2>
        <p className="text-gray-600">
          {filter === 'my-projects' 
            ? 'Track your project progress and make payments'
            : 'Browse and request from our project catalog'
          }
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Filter Buttons */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setFilter('my-projects')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'my-projects'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            My Projects
          </button>
          <button
            onClick={() => setFilter('all-projects')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all-projects'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-2" />
            All Projects
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Custom Project Button */}
<div className="flex justify-between items-center mb-6">
  <div className="text-sm text-gray-600">
    Showing {filteredData.length} of {filter === 'my-projects' ? myRequests.length : allProjects.length} projects
  </div>
  
  <button
    onClick={() => setShowCustomProjectModal(true)}
    className="btn-gradient text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-shadow"
  >
    <Plus className="w-4 h-4" />
    Request Custom Project
  </button>
</div>

      {/* Content */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {filter === 'my-projects' 
              ? (myRequests.length === 0 ? 'No projects yet' : 'No projects found')
              : (allProjects.length === 0 ? 'No projects available' : 'No projects found')
            }
          </h3>
          <p className="text-gray-500">
            {filter === 'my-projects'
              ? (myRequests.length === 0 
                  ? 'Start by requesting a project from our catalog'
                  : 'Try adjusting your search terms'
                )
              : 'Try adjusting your search terms'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filter === 'my-projects' ? (
            // Render user's requests
            filteredData.map((request) => {
              const primaryImage = request.project?.images?.find(img => img.isPrimary) || request.project?.images?.[0]
              
              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Project Image */}
                    <div className="lg:w-64 h-48 lg:h-auto">
                      {primaryImage ? (
                          <img
    src={`${import.meta.env.VITE_API_URL.replace('/api','')}${primaryImage.url}`}
    alt={primaryImage.alt || request.project?.name}
    className="w-full h-full object-cover"
    onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
  />
) : (
  <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
    <Monitor className="w-12 h-12 text-sky-400" />
  </div>
)}

                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
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
                        <div className="flex flex-col gap-2 lg:ml-4">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          
                          {request.githubLink && (
                            <a
                              href={request.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors text-center whitespace-nowrap"
                            >
                              <Eye className="w-4 h-4" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            // Render all projects for requesting
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredData.map((project, index) => {
                const CategoryIcon = categoryIcons[project.category] || Code
                const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]
                
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col">
                      {/* Project Image */}
                      <div className="aspect-video overflow-hidden">
                        {primaryImage ? (
                           <img
  src={`${import.meta.env.VITE_API_URL.replace('/api','')}${primaryImage.url}`}
  alt={primaryImage.alt || project.name}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                            <CategoryIcon className="w-12 h-12 text-sky-500" />
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">
                            {project.category}
                          </span>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm font-medium text-gray-600">4.9</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-sky-700 mb-2 group-hover:text-sky-800 transition-colors line-clamp-1">
                          {project.name}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
                          {project.description}
                        </p>

                        {/* Tech Stack Preview */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {[
                            ...(project.technologies?.frontend || []).slice(0, 2),
                            ...(project.technologies?.backend || []).slice(0, 1)
                          ].slice(0, 3).map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                          {((project.technologies?.frontend?.length || 0) + (project.technologies?.backend?.length || 0)) > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{((project.technologies?.frontend?.length || 0) + (project.technologies?.backend?.length || 0)) - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-green-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-2xl font-bold">₹{project.price?.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{project.duration}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <Link
                            to={`/projects/${project._id}`}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors text-center"
                          >
                            View Details
                          </Link>
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                          >
                            Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectDetailsModal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
      />

      {/* Request Modal for All Projects */}
      <RequestModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />

      {/* Custom Project Modal */}
<CustomProjectModal
  isOpen={showCustomProjectModal}
  onClose={() => setShowCustomProjectModal(false)}
/>
    </div>
  )
}

export default Dashboard
