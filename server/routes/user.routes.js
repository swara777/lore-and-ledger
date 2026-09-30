const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, saveQuizResult, updateRoadmapProgress } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// All routes are protected
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/quiz-result', saveQuizResult);
router.put('/roadmap-progress', updateRoadmapProgress);

module.exports = router;
