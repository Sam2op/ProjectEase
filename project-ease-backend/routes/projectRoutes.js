const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getDashboardProjects
} = require('../controllers/projectController');
const { uploadProjectImages, handleImageUpload } = require('../controllers/uploadController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById); // New route for detailed view

// User routes
router.get('/dashboard', authMiddleware, getDashboardProjects);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createProject);
router.put('/:id', authMiddleware, adminMiddleware, updateProject);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProject);

// Image upload route
router.post('/upload-images', authMiddleware, adminMiddleware, uploadProjectImages, handleImageUpload);

module.exports = router;
