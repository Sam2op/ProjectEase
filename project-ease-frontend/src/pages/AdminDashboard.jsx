import React, { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Search, Pencil, DollarSign, User, Mail } from 'lucide-react'
import RequestEditModal from '../components/RequestEditModal'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const [requests, setRequests] = useState([])
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-white-700'
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700'
      case 'completed':
        return 'bg-sky-100 text-sky-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'partial':
        return 'text-yellow-600'
      default:
        return 'text-red-600'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-sky-700">
            Admin Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Manage project requests and track progress</p>
        </div>
        <Link to="/admin/projects" className="btn-gradient px-4 py-2 text-white rounded-lg hover:shadow-lg transition-shadow">
          Manage Projects
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Pencil className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {requests.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 w-full md:w-96">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-sky-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Project / Custom</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Client</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Progress</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-sky-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {r.project ? r.project.name : r.customProject?.name || 'N/A'}
                      </div>
                      {r.customProject && (
                        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                          Custom Project
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm text-gray-900">
                        {r.clientType === 'registered' 
                          ? r.user?.username || 'N/A'
                          : r.guestInfo?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {r.clientType === 'registered' 
                          ? r.user?.email || 'N/A'
                          : r.guestInfo?.email || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        ₹{(r.actualPrice || r.estimatedPrice || 0).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {r.paymentOption === 'advance' ? '70% Advance' : 'Full Payment'}
                      </div>
                      <div className={`text-xs font-medium ${getPaymentStatusColor(r.paymentStatus)}`}>
                        {r.paymentStatus?.charAt(0).toUpperCase() + r.paymentStatus?.slice(1) || 'Pending'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {r.currentModule || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setEditing(r)}
                      className="p-2 hover:bg-sky-50 rounded-full transition-colors group"
                      title="Edit Request"
                    >
                      <Pencil className="w-4 h-4 text-sky-600 group-hover:text-sky-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">
              {query ? 'Try adjusting your search terms' : 'No project requests yet'}
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
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
