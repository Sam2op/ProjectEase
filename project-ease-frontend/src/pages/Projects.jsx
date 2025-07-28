import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, Filter, Star, Monitor, Smartphone, Brain, Code, DollarSign, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [priceFilter, setPriceFilter] = useState('all')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/projects')
        setProjects(data.projects)
      } catch (error) {
        toast.error('Failed to load projects', { autoClose: 5000 })
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const categoryIcons = {
    web: Monitor,
    mobile: Smartphone,
    desktop: Monitor,
    'ai-ml': Brain,
    other: Code
  }

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile Apps' },
    { value: 'desktop', label: 'Desktop Apps' },
    { value: 'ai-ml', label: 'AI/ML' },
    { value: 'other', label: 'Other' }
  ]

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-10000', label: 'Under ₹10,000' },
    { value: '10000-25000', label: '₹10,000 - ₹25,000' },
    { value: '25000-50000', label: '₹25,000 - ₹50,000' },
    { value: '50000+', label: 'Above ₹50,000' }
  ]

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // Search filter
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.technologies.frontend.some(tech => 
                             tech.toLowerCase().includes(searchQuery.toLowerCase())
                           ) ||
                           project.technologies.backend.some(tech => 
                             tech.toLowerCase().includes(searchQuery.toLowerCase())
                           )

      // Category filter
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter

      // Price filter
      let matchesPrice = true
      if (priceFilter !== 'all') {
        if (priceFilter === '50000+') {
          matchesPrice = project.price >= 50000
        } else {
          const [min, max] = priceFilter.split('-').map(Number)
          matchesPrice = project.price >= min && project.price <= max
        }
      }

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [projects, searchQuery, categoryFilter, priceFilter])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-xl h-80 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Explore Our Projects
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose from our extensive catalog of professionally developed projects, 
          each crafted with modern technologies and best practices.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Filter */}
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent appearance-none bg-white"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
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
                <Link to={`/projects/${project._id}`} className="block">
                  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden h-full">
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
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">
                          {project.category}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm font-medium text-gray-600">4.9</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors line-clamp-1">
                        {project.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack Preview */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {[
  ...(project.technologies?.frontend  || []),
  ...(project.technologies?.backend   || [])
]
                          .slice(0, 3)
                          .map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                            >
                              {tech}
                            </span>
                          ))}
                        {(project.technologies.frontend?.length + project.technologies.backend?.length) > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{(project.technologies.frontend.length + project.technologies.backend.length) - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600">
                          ₹{project.price.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm">{project.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Projects
