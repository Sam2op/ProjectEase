const express = require('express');
const router = express.Router();
const {
  getProjects, createProject, updateProject, deleteProject,getDashboardProjects
} = require('../controllers/projectController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getProjects)
  .post(authMiddleware, adminMiddleware, createProject);

router.get('/dashboard', authMiddleware, getDashboardProjects);

router.route('/:id')
  .put(authMiddleware, adminMiddleware, updateProject)
  .delete(authMiddleware, adminMiddleware, deleteProject);

module.exports = router;
