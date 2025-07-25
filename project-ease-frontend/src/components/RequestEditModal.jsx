import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import axios from 'axios'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS = ['pending', 'approved', 'in-progress', 'completed', 'rejected']

const RequestEditModal = ({ open, onClose, request, refresh }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: request })

  React.useEffect(() => reset(request), [request])

  if (!open) return null

  const onSubmit = async (data) => {
    try {
      await axios.put(`/requests/${request._id}`, data)
      toast.success('Request updated')
      refresh()
      onClose()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Update failed')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl w-[500px] p-6 relative"
      >
        <button className="absolute top-3 right-3" onClick={onClose}>
          <X className="text-gray-500" />
        </button>

        <h3 className="text-lg font-semibold text-sky-700 mb-4">
          Update {request.project?.name ?? request.customProject?.name}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <label className="block text-sm">Status</label>
          <select {...register('status')} className="w-full border rounded-lg px-3 py-2">
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <label className="block text-sm">Current Module</label>
          <input {...register('currentModule')} className="w-full border rounded-lg px-3 py-2" />

          <label className="block text-sm">
            Admin Notes (visible to user)
          </label>
          <textarea
            {...register('adminNotes')}
            rows={3}
            className="w-full border rounded-lg px-3 py-2"
          />

          <label className="block text-sm">GitHub URL</label>
          <input {...register('githubLink')} className="w-full border rounded-lg px-3 py-2" />

          <label className="block text-sm">Price (INR)</label>
          <input
            type="number"
            step="0.01"
            {...register('actualPrice')}
            className="w-full border rounded-lg px-3 py-2"
          />

          <button className="btn-gradient w-full text-white py-2 rounded-lg mt-2">
            Save Changes
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default RequestEditModal
