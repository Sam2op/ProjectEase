// src/components/PasswordInput.jsx
import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const PasswordInput = ({ 
  label = 'Password', 
  name, 
  register, 
  rules = {}, 
  placeholder = 'Password',
  // For controlled inputs (useState)
  value,
  onChange
}) => {
  const [visible, setVisible] = useState(false)
  
  // Determine if this is a controlled input or react-hook-form
  const isControlled = value !== undefined && onChange !== undefined
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          // Fixed: Use controlled props if provided, otherwise use react-hook-form register
          {...(isControlled 
            ? { value, onChange } 
            : (register ? register(name, rules) : {})
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
        >
          {visible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}

export default PasswordInput
