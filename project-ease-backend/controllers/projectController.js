const Project = require('../models/Project');

// @desc   Get all projects (public)
// @route  GET /api/projects
// @access Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate('createdBy', 'username')
      .select('-detailedDescription -workflow') // Exclude heavy fields for listing
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};

// @desc   Get single project by ID (detailed view)
// @route  GET /api/projects/:id
// @access Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'username');
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({ success: true, project });
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

// @desc   Update project (admin)
// @route  PUT /api/projects/:id
// @access Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid project ID format' 
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!project) {
      return res.status(404).json({ 
        success: false, 
        message: 'Project not found' 
      });
    }

    res.status(200).json({ success: true, project });
  } catch (err) {
    next(err);
  }
};

// @desc   Delete project (admin)
// @route  DELETE /api/projects/:id
// @access Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
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

// @desc   Get all active projects for user dashboard
// @route  GET /api/projects/dashboard
// @access Private (User)
exports.getDashboardProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ isActive: true })
      .select('name description technologies.frontend technologies.backend category duration price images')
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (err) {
    next(err);
  }
};
