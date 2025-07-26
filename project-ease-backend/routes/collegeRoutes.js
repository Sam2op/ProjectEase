const express = require('express');
const router = express.Router();
const colleges = require('../data/colleges');

// @desc   Get all colleges
// @route  GET /api/colleges
// @access Public
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    colleges
  });
});

module.exports = router;
