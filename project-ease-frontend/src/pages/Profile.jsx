// src/pages/Profile.jsx
import React, { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Camera, User, Mail, Phone, Github, Lock, Save, Trash2, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import PasswordInput from '../components/PasswordInput'

const Profile = () => {
  const { user, logout } = useAuth()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    githubLink: user?.githubLink || '',
    profilePicture: user?.profilePicture || ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handlePasswordChange = e => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value })
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    const reader = new FileReader()
    reader.onload = e => {
      setFormData({ ...formData, profilePicture: e.target.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!formData.username.trim()) {
      toast.error('Username is required')
      return
    }
    setLoading(true)
    try {
      const updateData = {
        username: formData.username.trim(),
        contactNumber: formData.contactNumber.trim(),
        githubLink: formData.githubLink.trim(),
        profilePicture: formData.profilePicture
      }
      await axios.put('/users/me', updateData)
      toast.success('Profile updated successfully')
      const updatedUser = { ...user, ...updateData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
    } catch (err) {
      console.error('Profile update error:', err)
      toast.error(err.response?.data?.message || 'Error updating profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Current password is required')
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await axios.put('/auth/update-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      toast.success('Password updated! Check your email for details.')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      // This will now properly show "Current password is incorrect" without logging out
      toast.error(err.response?.data?.message || 'Error updating password')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setLoading(true)
    try {
      await axios.delete('/users/me')
      toast.success('Account deleted successfully')
      logout() // This will clear auth state and redirect to login
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting account')
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">My Profile</h1>
          <p className="text-sky-100 mt-1">Manage your account settings</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {[
              { id: 'profile', label: 'Profile Info', icon: User },
              { id: 'security', label: 'Security', icon: Lock }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-4 border-b-2 font-medium text-sm ${
                  activeTab === id
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold cursor-pointer overflow-hidden"
                    onClick={handleProfilePictureClick}
                  >
                    {formData.profilePicture ? (
                      <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      formData.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    onClick={handleProfilePictureClick}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50"
                  >
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Picture</h3>
                  <p className="text-sm text-gray-500">Click to upload a new profile picture</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Github className="w-4 h-4 inline mr-2" />
                    GitHub Profile
                  </label>
                  <input
                    type="url"
                    name="githubLink"
                    value={formData.githubLink}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="btn-gradient text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="spinner mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">Password Security</h3>
                <p className="text-sm text-sky-700">
                  Secure your account with a strong password.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900 mb-2">Change Password</h4>
                <PasswordInput
                  label="Current Password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
                <PasswordInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="btn-gradient text-white px-6 py-2 rounded-lg flex items-center disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="spinner mr-2" />
                    ) : (
                      <Lock className="w-4 h-4 mr-2" />
                    )}
                    Update Password
                  </button>
                </div>
              </div>

              {/* Account Actions */}
              <div className="border-t pt-6 mt-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Account Actions
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    Logout from All Devices
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-600">Delete Account</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete your account? This will permanently remove:
              </p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Your profile and personal information</li>
                <li>• All your project requests and history</li>
                <li>• Any ongoing projects and communications</li>
                <li>• Access to your dashboard and data</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Profile
