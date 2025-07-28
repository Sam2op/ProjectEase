import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import PasswordInput from '../components/PasswordInput'
import { CheckCircle, User, Mail, Phone, Github, GraduationCap, Briefcase } from 'lucide-react'

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false)
  const [collegeSearch, setCollegeSearch] = useState('')

  const userType = watch('userType')

  useEffect(() => {
    // Fetch colleges list
    const fetchColleges = async () => {
      try {
        const response = await axios.get('/colleges')
        setColleges(response.data.colleges)
        setFilteredColleges(response.data.colleges)
      } catch (error) {
        console.error('Failed to fetch colleges:', error)
      }
    }
    fetchColleges()
  }, [])

  const handleCollegeSearch = (value) => {
    setCollegeSearch(value)
    const filtered = colleges.filter(college =>
      college.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredColleges(filtered)
    setShowCollegeDropdown(true)
  }

  const selectCollege = (college) => {
    setCollegeSearch(college)
    setShowCollegeDropdown(false)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
     const payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      contactNumber: data.contactNumber,
      userType: data.userType,
      college: data.userType === 'student' ? collegeSearch : '',
      githubLink: data.githubLink || ''
    }
      const response = await axios.post('/auth/signup', payload)
      if (response.data.success) {
        setEmailSent(true)
        toast.success(response.data.message, { autoClose: 5000 })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating account', { autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="glass p-10 rounded-xl shadow-lg w-96 text-center space-y-4">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-sky-700">Check Your Email!</h2>
          <p className="text-gray-600">
            We've sent a verification link to your email address. 
            Please click the link to verify your account and complete the registration.
          </p>
          <div className="text-center mt-6">
            <Link to="/login" className="text-sky-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="glass p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-sky-700 mb-6">
          Create Your Account
        </h2>
        
        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="w-4 h-4 inline mr-2" />
            Username
          </label>
          <input
            {...register('username', { 
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            placeholder="Your username"
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.username ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </label>
          <input
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email'
              }
            })}
            type="email"
            placeholder="your@email.com"
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contact Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="w-4 h-4 inline mr-2" />
            Contact Number
          </label>
          <input
            {...register('contactNumber', { 
              required: 'Contact number is required',
              pattern: {
                value: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid contact number'
              }
            })}
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.contactNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        {/* User Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="w-4 h-4 inline mr-2" />
            I am a
          </label>
          <select
            {...register('userType', { required: 'Please select your user type' })}
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.userType ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your status</option>
            <option value="student">Student</option>
            <option value="self-employed">Self Employed</option>
            <option value="professional">Professional</option>
          </select>
          {errors.userType && (
            <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>
          )}
        </div>

        {/* College (only for students) */}
        {userType === 'student' && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <GraduationCap className="w-4 h-4 inline mr-2" />
              College/University
            </label>
            <input
              type="text"
              value={collegeSearch}
              onChange={(e) => handleCollegeSearch(e.target.value)}
              onFocus={() => setShowCollegeDropdown(true)}
              placeholder="Search for your college..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
            {showCollegeDropdown && filteredColleges.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {filteredColleges.slice(0, 10).map((college, index) => (
                  <div
                    key={index}
                    onClick={() => selectCollege(college)}
                    className="px-3 py-2 hover:bg-sky-50 cursor-pointer text-sm"
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* GitHub Link (optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Github className="w-4 h-4 inline mr-2" />
            GitHub Profile (Optional)
          </label>
          <input
            {...register('githubLink', {
              pattern: {
                value: /^https:\/\/github\.com\/[a-zA-Z0-9_-]+\/?$/,
                message: 'Please enter a valid GitHub URL'
              }
            })}
            type="url"
            placeholder="https://github.com/yourusername"
            className={`w-full border rounded-lg px-3 py-2 ${
              errors.githubLink ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.githubLink && (
            <p className="text-red-500 text-sm mt-1">{errors.githubLink.message}</p>
          )}
        </div>
        
        {/* Password */}
        <div>
          <PasswordInput
            register={register}
            name="password"
            label="Password"
            placeholder="Password"
            rules={{ 
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-2 rounded-lg text-white disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="spinner mr-2" />
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
        
        <div className="text-center">
          <Link to="/login" className="text-sm text-sky-600 hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Signup
