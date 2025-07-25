const Project = require('../models/Project');

// @desc   Get all projects (public)
// @route  GET /api/projects
// @access Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

// @desc   Create new project (admin)
// @route  POST /api/projects
// @access Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @desc   Update project (admin) - FIXED
// @route  PUT /api/projects/:id
// @access Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID format' 
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    // Update fields safely
    const allowedUpdates = [
      'name', 'description', 'technologies', 'category', 
      'duration', 'price', 'features', 'demoUrl', 'githubUrl', 'isActive'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    // Handle technologies array properly
    if (req.body.technologies && Array.isArray(req.body.technologies)) {
      project.technologies = req.body.technologies;
    } else if (req.body.technologies && typeof req.body.technologies === 'string') {
      project.technologies = req.body.technologies.split(',').map(t => t.trim());
    }

    await project.save();

    res.status(200).json({ success: true, project });
  } catch (err) {
    console.error('Project update error:', err);
    
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      return res.status(400).json({ success: false, message });
    }
    
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID' 
      });
    }

    next(err);
  }
};

// @desc   Delete project (admin)
// @route  DELETE /api/projects/:id
// @access Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID format' 
      });
    }

    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project removed successfully' });
  } catch (err) {
    next(err);
  }
};
