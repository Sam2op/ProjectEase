const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: 500
  },
  detailedDescription: {
    type: String,
    required: [true, 'Detailed description is required'],
    maxlength: 2000
  },
  technologies: {
    frontend: [{
      type: String,
      required: true
    }],
    backend: [{
      type: String,
      required: true
    }],
    database: [{
      type: String
    }],
    other: [{
      type: String
    }]
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['web', 'mobile', 'desktop', 'ai-ml', 'other']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  features: [{
    type: String
  }],
  workflow: [{
    step: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
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
