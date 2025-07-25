import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, Pencil } from 'lucide-react'
import RequestEditModal from '../components/RequestEditModal'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

  // ────────────────────────────────────────────
  // FIXED: Proper useEffect with async function inside
  // ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const fetchRequests = async () => {
      try {
        const { data } = await axios.get('/requests')
        if (!cancelled) {
          setRequests(data.requests)
        }
      } catch (err) {
        if (!cancelled) {
          toast.error('Failed to load requests')
        }
      }
    }

    fetchRequests()

    // Proper cleanup function
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(
    () =>
      requests.filter((r) =>
        (r.project?.name || r.customProject?.name || '')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query, requests]
  )

  const refreshRequests = async () => {
    try {
      const { data } = await axios.get('/requests')
      setRequests(data.requests)
    } catch (err) {
      toast.error('Failed to refresh requests')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-sky-700">
          Admin • Project Requests
        </h2>
        <Link to="/admin/projects" className="btn-gradient px-4 py-2 text-white rounded-lg">
          Manage Projects
        </Link>
      </div>

      {/* search */}
      <div className="relative mb-6 w-full md:w-96">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className="w-full border rounded-lg py-2 pl-10 pr-3"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow text-sm">
          <thead className="bg-sky-100 text-sky-700">
            <tr>
              <th className="px-4 py-3 text-left">Project / Custom</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="px-4 py-3">
                  {r.project ? r.project.name : r.customProject?.name || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {r.clientType === 'registered' 
                    ? r.user?.username || 'N/A'
                    : r.guestInfo?.email || 'N/A'}
                </td>
                <td className="px-4 py-3 capitalize">{r.status}</td>
                <td className="px-4 py-3">₹{r.actualPrice || r.estimatedPrice || 0}</td>
                <td className="px-4 py-3">{r.currentModule || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setEditing(r)}
                    className="p-2 hover:bg-sky-50 rounded-full"
                  >
                    <Pencil className="w-4 h-4 text-sky-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modal */}
      <RequestEditModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        request={editing}
        refresh={refreshRequests}
      />
    </div>
  )
}

export default AdminDashboard
