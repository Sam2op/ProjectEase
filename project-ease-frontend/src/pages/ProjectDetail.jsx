import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  ArrowLeft, ExternalLink, Github,
  Clock, DollarSign, Tag,
  ChevronLeft, ChevronRight, Monitor,
  CheckCircle, Server, Database, Zap
} from 'lucide-react'
import { motion } from 'framer-motion'
import RequestModal from '../components/RequestModal'

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await axios.get(`/projects/${id}`)
        setProject(data.project)
      } catch {
        toast.error('Project not found', { autoClose: 5000 })
        navigate('/projects')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id, navigate])

  const next = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length)
    }
  }

  const prev = () => {
    if (project?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length)
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

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Project not found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 btn-gradient px-6 py-2 rounded-lg"
        >
          Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sky-600 hover:text-sky-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {project.images && project.images.length > 0 ? (
            <>
              <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-video">
                <img
       src={`${import.meta.env.VITE_API_URL.replace('/api','')}${project.images[currentImageIndex].url}`}
       alt={project.images[currentImageIndex].alt || project.name}
       className="w-full h-full object-cover"
       onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
     />
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={prev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={next}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {project.images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentImageIndex(i)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {project.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {project.images.slice(0, 4).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-video rounded-lg overflow-hidden border-2 transition-colors ${
                        idx === currentImageIndex ? 'border-sky-500' : 'border-gray-200'
                      }`}
                    >
                      <img
             src={`${import.meta.env.VITE_API_URL.replace('/api','')}${img.url}`}
             alt={img.alt || project.name}
             className="w-full h-full object-cover"
             onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
           />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center rounded-xl">
              <Monitor className="w-20 h-20 text-sky-400" />
              <span className="sr-only">{project.name}</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-5 h-5 text-sky-600" />
              <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm capitalize">
                {project.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
            <p className="text-gray-600 text-lg">{project.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Price</span>
              </div>
              <p className="text-2xl font-bold text-green-600">₹{project.price.toLocaleString()}</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Duration</span>
              </div>
              <p className="text-lg font-semibold text-blue-600">{project.duration}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex-1 btn-gradient py-3 rounded-lg text-white font-semibold hover:shadow-lg"
            >
              Request This Project
            </button>

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-sky-600 border border-sky-300 rounded-lg hover:bg-sky-50"
              >
                <ExternalLink />
                Demo
              </a>
            )}
          </div>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Github />
              View Source Code
            </a>
          )}
        </div>
      </div>

<div className="grid lg:grid-cols-3 gap-8 mt-16">
  {/* Left: About, Features & Workflow */}
  <div className="lg:col-span-2 prose prose-sky max-w-none space-y-6">
    <h2 className="text-2xl font-bold text-sky-700">About This Project</h2>
    <p className="text-gray-700">{project.detailedDescription}</p>

    {project.features?.length > 0 && (
      <>
        <h2 className="text-2xl font-bold text-sky-700">Key Features</h2>
        <ul className="list-disc ml-6 space-y-2">
          {project.features.map((feature, i) => (
            <li key={i} className="text-gray-700">{feature}</li>
          ))}
        </ul>
      </>
    )}

    {project.workflow?.length > 0 && (
      <>
        <h2 className="text-2xl font-bold text-sky-700">Project Workflow</h2>
        <ol className="list-decimal ml-6 space-y-2">
          {project.workflow.map((step, i) => (
            <li key={i} className="text-gray-700">
              <strong className="text-sky-700">{step.step}:</strong> {step.description}
            </li>
          ))}
        </ol>
      </>
    )}
  </div>

  {/* Right: Technology Stack */}
  <div className="space-y-8">
    <h2 className="text-2xl font-bold text-sky-700 mb-4">Technology Stack</h2>

    {(project.technologies?.frontend || []).length > 0 && (
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
          <Monitor className="w-5 h-5 text-blue-600" /> Frontend
        </h3>
        <ul className="list-disc ml-6 space-y-1">
          {project.technologies.frontend.map((tech, i) => (
            <li key={i} className="text-gray-700">{tech}</li>
          ))}
        </ul>
      </div>
    )}

    {(project.technologies?.backend || []).length > 0 && (
      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-green-700 font-semibold mb-2">
          <Server className="w-5 h-5 text-green-600" /> Backend
        </h3>
        <ul className="list-disc ml-6 space-y-1">
          {project.technologies.backend.map((tech, i) => (
            <li key={i} className="text-gray-700">{tech}</li>
          ))}
        </ul>
      </div>
    )}

    {(project.technologies?.database || []).length > 0 && (
      <div className="bg-purple-50 rounded-lg p-4">
        <h3 className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
          <Database className="w-5 h-5 text-purple-600" /> Database
        </h3>
        <ul className="list-disc ml-6 space-y-1">
          {project.technologies.database.map((tech, i) => (
            <li key={i} className="text-gray-700">{tech}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>


      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        project={project}
      />
    </div>
  )
}

export default ProjectDetail
