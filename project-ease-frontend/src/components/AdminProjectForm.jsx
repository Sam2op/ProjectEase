import React, { useState, useEffect } from 'react'
import { X, Plus, Upload, Trash2, Star, Image as ImageIcon } from 'lucide-react'
import { toast } from 'react-toastify'
import axios from 'axios'

const AdminProjectForm = ({ open, onClose, onCreated, initial }) => {
  const [loading, setLoading] = useState(false)
  const [imageUploadLoading, setImageUploadLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    detailedDescription: '',
    category: 'web',
    duration: '',
    price: '',
    demoUrl: '',
    githubUrl: '',
    technologies: {
      frontend: [''],
      backend: [''],
      database: [''],
      other: ['']
    },
    features: [''],
    workflow: [{ step: '', description: '' }],
    images: []
  })

  useEffect(() => {
    if (initial) {
      setFormData({
        name: initial.name || '',
        description: initial.description || '',
        detailedDescription: initial.detailedDescription || '',
        category: initial.category || 'web',
        duration: initial.duration || '',
        price: initial.price || '',
        demoUrl: initial.demoUrl || '',
        githubUrl: initial.githubUrl || '',
        technologies: {
          frontend: initial.technologies?.frontend?.length ? initial.technologies.frontend : [''],
          backend: initial.technologies?.backend?.length ? initial.technologies.backend : [''],
          database: initial.technologies?.database?.length ? initial.technologies.database : [''],
          other: initial.technologies?.other?.length ? initial.technologies.other : ['']
        },
        features: initial.features?.length ? initial.features : [''],
        workflow: initial.workflow?.length ? initial.workflow : [{ step: '', description: '' }],
        images: initial.images || []
      })
    } else {
      setFormData({
        name: '',
        description: '',
        detailedDescription: '',
        category: 'web',
        duration: '',
        price: '',
        demoUrl: '',
        githubUrl: '',
        technologies: {
          frontend: [''],
          backend: [''],
          database: [''],
          other: ['']
        },
        features: [''],
        workflow: [{ step: '', description: '' }],
        images: []
      })
    }
  }, [initial, open])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleArrayInputChange = (category, index, value) => {
    setFormData(prev => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        [category]: prev.technologies[category].map((item, i) => i === index ? value : item)
      }
    }))
  }

  const addArrayItem = (category) => {
    setFormData(prev => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        [category]: [...prev.technologies[category], '']
      }
    }))
  }

  const removeArrayItem = (category, index) => {
    setFormData(prev => ({
      ...prev,
      technologies: {
        ...prev.technologies,
        [category]: prev.technologies[category].filter((_, i) => i !== index)
      }
    }))
  }

  const handleFeatureChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((item, i) => i === index ? value : item)
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleWorkflowChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      workflow: prev.workflow.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const addWorkflowStep = () => {
    setFormData(prev => ({
      ...prev,
      workflow: [...prev.workflow, { step: '', description: '' }]
    }))
  }

  const removeWorkflowStep = (index) => {
    setFormData(prev => ({
      ...prev,
      workflow: prev.workflow.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setImageUploadLoading(true)
    try {
      const formDataUpload = new FormData()
      files.forEach(file => {
        formDataUpload.append('images', file)
      })

      const response = await axios.post('/upload/project-images', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.images]
        }))
        toast.success('Images uploaded successfully!', { autoClose: 3000 })
      }
    } catch (error) {
      toast.error('Failed to upload images', { autoClose: 5000 })
      console.error('Image upload error:', error)
    } finally {
      setImageUploadLoading(false)
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up data
      const submitData = {
        ...formData,
        price: Number(formData.price),
        technologies: {
          frontend: formData.technologies.frontend.filter(t => t.trim()),
          backend: formData.technologies.backend.filter(t => t.trim()),
          database: formData.technologies.database.filter(t => t.trim()),
          other: formData.technologies.other.filter(t => t.trim())
        },
        features: formData.features.filter(f => f.trim()),
        workflow: formData.workflow.filter(w => w.step.trim() && w.description.trim())
      }

      let response
      if (initial) {
        response = await axios.put(`/projects/${initial._id}`, submitData)
      } else {
        response = await axios.post('/projects', submitData)
      }

      if (response.data.success) {
        toast.success(`Project ${initial ? 'updated' : 'created'} successfully!`, { autoClose: 3000 })
        onCreated()
        onClose()
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.response?.data?.message || `Failed to ${initial ? 'update' : 'create'} project`, { autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {initial ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
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
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 2-3 weeks"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo URL (Optional)
              </label>
              <input
                type="url"
                name="demoUrl"
                value={formData.demoUrl}
                onChange={handleInputChange}
                placeholder="https://demo.example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL (Optional)
              </label>
              <input
                type="url"
                name="githubUrl"
                value={formData.githubUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/user/repo"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              name="detailedDescription"
              value={formData.detailedDescription}
              onChange={handleInputChange}
              rows="6"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Project Images
            </label>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-sky-500 transition-colors">
                <div className="text-center">
                  {imageUploadLoading ? (
                    <div className="spinner w-6 h-6 mx-auto mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-600">
                    {imageUploadLoading ? 'Uploading...' : 'Click to upload images'}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={imageUploadLoading}
                />
              </label>
            </div>

            {/* Image Grid */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={image.alt || `Project image ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    
                    {/* Image Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className={`p-1 rounded ${
                          image.isPrimary ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'
                        }`}
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 text-white rounded"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Primary Image Badge */}
                    {image.isPrimary && (
                      <div className="absolute top-1 left-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technologies */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology Stack</h3>
            
            {['frontend', 'backend', 'database', 'other'].map(category => (
              <div key={category} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                  {category === 'other' ? 'Other Tools' : category}
                </label>
                <div className="space-y-2">
                  {formData.technologies[category].map((tech, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={tech}
                        onChange={(e) => handleArrayInputChange(category, index, e.target.value)}
                        placeholder={`Enter ${category} technology`}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      />
                      {formData.technologies[category].length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem(category, index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem(category)}
                    className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add {category} technology
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter a key feature"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add feature
              </button>
            </div>
          </div>

          {/* Workflow */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Workflow</h3>
            <div className="space-y-4">
              {formData.workflow.map((step, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Step {index + 1}</span>
                    {formData.workflow.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeWorkflowStep(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleWorkflowChange(index, 'step', e.target.value)}
                      placeholder="Step title"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => handleWorkflowChange(index, 'description', e.target.value)}
                      placeholder="Step description"
                      rows="2"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addWorkflowStep}
                className="flex items-center gap-2 text-sky-600 hover:text-sky-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add workflow step
              </button>
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
              disabled={loading || imageUploadLoading}
              className="flex-1 btn-gradient text-white px-6 py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  {initial ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                initial ? 'Update Project' : 'Create Project'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminProjectForm
