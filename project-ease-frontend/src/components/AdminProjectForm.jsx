import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { toast } from 'react-toastify'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const CATEGORIES = ['web', 'mobile', 'desktop', 'ai-ml', 'other']

const AdminProjectForm = ({ open, onClose, onCreated, initial }) => {
  const isEdit = Boolean(initial?._id)
  const { register, handleSubmit, reset, setValue } = useForm({
    defaultValues: initial || {
      name: '',
      description: '',
      technologies: '',
      category: 'web',
      duration: '',
      price: 0
    }
  })

  // When initial prop changes, update the form fields appropriately
  useEffect(() => {
    if (initial) {
      // If technologies is an array, convert to comma string for input display
      const techString = Array.isArray(initial.technologies) 
        ? initial.technologies.join(', ') 
        : initial.technologies || ''

      reset({
        ...initial,
        technologies: techString
      })
    } else {
      reset()
    }
  }, [initial, reset])

  if (!open) return null

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        technologies: data.technologies.split(',').map(t => t.trim()).filter(Boolean)
      }
      if (isEdit) {
        await axios.put(`/projects/${initial._id}`, payload)
        toast.success('Project updated')
      } else {
        await axios.post('/projects', payload)
        toast.success('Project created')
      }
      onCreated()
      onClose()
      reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl w-[480px] p-6 relative"
      >
        <button onClick={() => { onClose(); reset(); }} className="absolute right-3 top-3 text-gray-500">
          <X />
        </button>

        <h2 className="text-xl font-semibold text-sky-700 mb-4">
          {isEdit ? 'Edit Project' : 'Add New Project'}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register('name', { required: true })} placeholder="Name" className="w-full border rounded-lg px-3 py-2" />
          <textarea {...register('description', { required: true })} placeholder="Description" className="w-full border rounded-lg px-3 py-2 h-24" />
          <input {...register('technologies', { required: true })} placeholder="Technologies (comma-separated)" className="w-full border rounded-lg px-3 py-2" />
          <select {...register('category')} className="w-full border rounded-lg px-3 py-2">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input {...register('duration', { required: true })} placeholder="Duration (e.g. 3 weeks)" className="w-full border rounded-lg px-3 py-2" />
          <input type="number" step="0.01" {...register('price', { required: true })} placeholder="Price (INR)" className="w-full border rounded-lg px-3 py-2" />
          <button type="submit" className="btn-gradient text-white w-full py-2 rounded-lg">
            {isEdit ? 'Update' : 'Create'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default AdminProjectForm
