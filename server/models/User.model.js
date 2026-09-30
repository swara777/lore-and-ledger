const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  standard: {
    type: String,
    required: [true, 'Academic Standard is required'],
    enum: [
      'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
      'Undergraduate', 'Postgraduate'
    ]
  },
  interests: [{
    type: String,
    enum: [
      'Technology', 'Design', 'Business', 'Science',
      'Arts', 'Medicine', 'Law', 'Finance',
      'Engineering', 'Education'
    ]
  }],
  quizResults: [{
    career: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number },
    takenAt: { type: Date, default: Date.now }
  }],
  roadmapProgress: {
    currentCareer: { type: String, default: '' },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    completedSteps: [{ type: String }]
  },
  badges: [{
    type: String,
    enum: [
      'First Quiz', 'Explorer', 'Pathfinder', 'Quiz Master',
      'Goal Setter', 'Consistent Learner', 'Career Ready'
    ]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
