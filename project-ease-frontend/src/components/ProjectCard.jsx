import React from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Clock, DollarSign, Monitor } from 'lucide-react'
import { motion } from 'framer-motion'

const ProjectCard = ({ project, index = 0 }) => {
  const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Project Image */}
      <div className="relative h-48 bg-gradient-to-br from-sky-100 to-blue-100 overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Monitor className="w-16 h-16 text-sky-400" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            project.category === 'web' ? 'bg-blue-500 text-white' :
            project.category === 'mobile' ? 'bg-green-500 text-white' :
            project.category === 'desktop' ? 'bg-purple-500 text-white' :
            project.category === 'ai-ml' ? 'bg-red-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {project.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-sky-700 mb-2 group-hover:text-sky-800 transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
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
              className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded"
            >
              {tech}
            </span>
          ))}
          {(project.technologies?.frontend?.length + project.technologies?.backend?.length > 3) && (
            <span className="text-xs text-gray-500">+more</span>
          )}
        </div>

        {/* Price and Duration */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-green-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">₹{project.price}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{project.duration}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/projects/${project._id}`}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
}

export default ProjectCard
