import React, { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Camera, User, Mail, Phone, Github, Lock, Save, Send } from 'lucide-react'
import { motion } from 'framer-motion'

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Convert to base64 for demo purposes
    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData({
        ...formData,
        profilePicture: e.target.result
      })
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
      
      // Update local storage user data
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
      
      toast.success('Password updated successfully! Check your email for confirmation.')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setLoading(true)
    try {
      await axios.post('/auth/forgot-password', { email: user.email })
      toast.success('Password reset link sent to your email automatically!')
    } catch (err) {
      toast.error('Error sending reset email')
    } finally {
      setLoading(false)
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Profile Picture */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white text-2xl font-semibold cursor-pointer overflow-hidden"
                    onClick={handleProfilePictureClick}
                  >
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profile Picture
                  </h3>
                  <p className="text-sm text-gray-500">
                    Click to upload a new profile picture
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
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
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed
                  </p>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-sky-800 mb-2">
                  Password Security
                </h3>
                <p className="text-sm text-sky-700">
                  Keep your account secure by using a strong password and changing it regularly.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">
                  Change Password
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

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
                  
                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-sky-600 hover:text-sky-800 px-4 py-2 rounded-lg border border-sky-300 hover:bg-sky-50 flex items-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reset Email
                  </button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Click "Send Reset Email" to automatically receive a password reset link in your email.
                </p>
              </div>

              {/* Account Actions */}
              <div className="border-t pt-6 mt-8">
                <h4 className="text-md font-semibold text-gray-900 mb-4">
                  Account Actions
                </h4>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800 px-4 py-2 rounded-lg border border-red-300 hover:bg-red-50"
                >
                  Logout from All Devices
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile
