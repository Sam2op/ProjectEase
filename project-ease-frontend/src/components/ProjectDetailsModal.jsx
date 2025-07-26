import React from 'react'
import { X, Calendar, DollarSign, Clock, User, Github, ExternalLink, Monitor, Server, Database, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const ProjectDetailsModal = ({ open, onClose, request }) => {
  if (!open || !request) return null

  const project = request.project || request.customProject
  
  // Safe array access with fallbacks
  const frontendTech = project?.technologies?.frontend || []
  const backendTech = project?.technologies?.backend || []
  const databaseTech = project?.technologies?.database || []
  const otherTech = project?.technologies?.other || []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {project?.name || 'Project Details'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Project Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Requested: {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {project?.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Duration: {project.duration}</span>
                    </div>
                  )}
                  
                  {(request.actualPrice || request.estimatedPrice) && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Price: ₹{request.actualPrice || request.estimatedPrice}
                      </span>
                    </div>
                  )}
                  
                  
                </div>
              </div>

              {/* Status & Progress */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Status & Progress</h3>
                <div className="space-y-2">
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    request.status === 'approved' ? 'bg-green-100 text-green-700' :
                    request.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    request.status === 'completed' ? 'bg-sky-100 text-sky-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </div>
                  
                  {request.currentModule && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-700">Current Module</p>
                      <p className="text-blue-600">{request.currentModule}</p>
                    </div>
                  )}
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">Payment Status</p>
                    <p className={`font-medium ${
                      request.paymentStatus === 'completed' ? 'text-green-600' :
                      request.paymentStatus === 'partial' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {request.paymentStatus?.charAt(0).toUpperCase() + request.paymentStatus?.slice(1)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {project?.description || 'No description available'}
                </p>
              </div>

              {/* Admin Notes */}
              {request.adminNotes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Latest Update</h3>
                  <div className="bg-sky-50 border-l-4 border-sky-500 p-3">
                    <p className="text-sky-600 text-sm">{request.adminNotes}</p>
                  </div>
                </div>
              )}

              {/* External Links */}
              <div className="space-y-2">
                {request.githubLink && (
                  <a
                    href={request.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {project?.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sky-600 hover:text-sky-500 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="text-sm">View Demo</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Technology Stack */}
          {(frontendTech.length > 0 || backendTech.length > 0 || databaseTech.length > 0 || otherTech.length > 0) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Frontend */}
                {frontendTech.length > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Monitor className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-700">Frontend</h4>
                    </div>
                    <div className="space-y-1">
                      {frontendTech.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Backend */}
                {backendTech.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Server className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-700">Backend</h4>
                    </div>
                    <div className="space-y-1">
                      {backendTech.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-green-100 text-green-700 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Database */}
                {databaseTech.length > 0 && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Database className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-700">Database</h4>
                    </div>
                    <div className="space-y-1">
                      {databaseTech.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other */}
                {otherTech.length > 0 && (
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-700">Other Tools</h4>
                    </div>
                    <div className="space-y-1">
                      {otherTech.map((tech, index) => (
                        <span
                          key={index}
                          className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded mr-1 mb-1"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Project Details */}
          {request.customProject && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Custom Requirements</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {request.customProject.requirements || 'No specific requirements provided'}
                </p>
              </div>
            </div>
          )}

          {/* Status History */}
          {request.statusHistory && request.statusHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
              <div className="space-y-3">
                {request.statusHistory.map((status, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'pending' ? 'bg-yellow-500' :
                      status.status === 'approved' ? 'bg-green-500' :
                      status.status === 'in-progress' ? 'bg-blue-500' :
                      status.status === 'completed' ? 'bg-sky-500' :
                      'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 capitalize">
                          {status.status.replace('-', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(status.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {status.notes && (
                        <p className="text-sm text-gray-600 mt-1">{status.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ProjectDetailsModal
