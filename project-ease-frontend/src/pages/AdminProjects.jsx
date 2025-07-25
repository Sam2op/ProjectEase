import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash } from 'lucide-react'
import { toast } from 'react-toastify'
import AdminProjectForm from '../components/AdminProjectForm'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  // ------------------------------------------------------------------
  // helpers
  // ------------------------------------------------------------------
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get('/projects')
      setProjects(data.projects)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load projects')
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await axios.delete(`/projects/${id}`)
      toast.success('Project deleted')
      fetchProjects()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed')
    }
  }

  // ------------------------------------------------------------------
  // effects
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await axios.get('/projects')
      if (!cancelled) setProjects(data.projects)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // ------------------------------------------------------------------
  // render
  // ------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-sky-700">Manage Projects</h2>
        <button
          onClick={() => {
            setEditing(null)
            setModalOpen(true)
          }}
          className="flex items-center btn-gradient text-white px-4 py-2 rounded-lg ring-1 ring-sky-500/40"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow">
          <thead className="bg-sky-100 text-sky-700">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-b">
                {/* use motion.td for safe animation */}
                <motion.td layout className="px-4 py-3">
                  {p.name}
                </motion.td>
                <motion.td layout className="px-4 py-3 capitalize">
                  {p.category}
                </motion.td>
                <motion.td layout className="px-4 py-3">
                  ₹{p.price}
                </motion.td>
                <motion.td layout className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => {
                      setEditing(p)
                      setModalOpen(true)
                    }}
                    className="p-2 rounded-full hover:bg-sky-50"
                  >
                    <Pencil className="w-4 h-4 text-sky-600" />
                  </button>
                  <button
                    onClick={() => remove(p._id)}
                    className="p-2 rounded-full hover:bg-red-50"
                  >
                    <Trash className="w-4 h-4 text-red-600" />
                  </button>
                </motion.td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      <AdminProjectForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={fetchProjects}
        initial={editing}
      />
    </div>
  )
}

export default AdminProjects
