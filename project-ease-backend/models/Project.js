const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  technologies: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['web', 'mobile', 'desktop', 'ai-ml', 'other']
  },
  duration: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, 'Project price is required'],
    min: 0
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  demoUrl: {
    type: String,
    default: ''
  },
  githubUrl: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
