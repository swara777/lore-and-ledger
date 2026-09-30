const User = require('../models/User.model');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile (standard, interests)
// @route   PUT /api/user/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { standard, interests, name } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (standard) updateData.standard = standard;
    if (interests && interests.length > 0) updateData.interests = interests;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Save quiz result
// @route   PUT /api/user/quiz-result
// @access  Private
const saveQuizResult = async (req, res) => {
  try {
    const { career, score, totalQuestions } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add quiz result
    user.quizResults.push({
      career,
      score,
      totalQuestions,
      takenAt: new Date()
    });

    // Update roadmap to the latest career result
    user.roadmapProgress.currentCareer = career;
    user.roadmapProgress.percentage = 0;
    user.roadmapProgress.completedSteps = [];

    // Award badges
    if (user.quizResults.length === 1 && !user.badges.includes('First Quiz')) {
      user.badges.push('First Quiz');
    }
    if (user.quizResults.length >= 3 && !user.badges.includes('Quiz Master')) {
      user.badges.push('Quiz Master');
    }
    if (!user.badges.includes('Pathfinder')) {
      user.badges.push('Pathfinder');
    }

    await user.save();

    res.json({
      quizResults: user.quizResults,
      roadmapProgress: user.roadmapProgress,
      badges: user.badges
    });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update roadmap progress
// @route   PUT /api/user/roadmap-progress
// @access  Private
const updateRoadmapProgress = async (req, res) => {
  try {
    const { percentage, completedSteps } = req.body;

    const updateData = {};
    if (percentage !== undefined) updateData['roadmapProgress.percentage'] = percentage;
    if (completedSteps) updateData['roadmapProgress.completedSteps'] = completedSteps;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Award badge for progress
    if (percentage >= 50 && !user.badges.includes('Goal Setter')) {
      user.badges.push('Goal Setter');
      await user.save();
    }
    if (percentage >= 100 && !user.badges.includes('Career Ready')) {
      user.badges.push('Career Ready');
      await user.save();
    }

    res.json(user);
  } catch (error) {
    console.error('Update roadmap progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile, saveQuizResult, updateRoadmapProgress };
