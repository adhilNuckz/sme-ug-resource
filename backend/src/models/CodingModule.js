const mongoose = require('mongoose');

/**
 * Coding Module Schema
 * Stores interactive coding exercises and simulations
 */
const codingModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Module description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'DSA',
      'Computer Graphics',
      'Computer Networks',
      'Encryption Algorithms',
      'Sorting Algorithms',
      'Graph Algorithms',
      'Dynamic Programming',
      'Other'
    ]
  },
  type: {
    type: String,
    required: [true, 'Module type is required'],
    enum: ['coding', 'simulation', 'visualization']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['tamil', 'sinhala', 'english']
  },
  // Programming language used in the module
  programmingLanguage: {
    type: String,
    enum: ['javascript', 'python', 'java', 'cpp', 'c'],
    default: 'javascript'
  },
  // Default code template
  defaultCode: {
    type: String,
    required: true
  },
  // Sample inputs for testing
  sampleInputs: [{
    input: String,
    expectedOutput: String,
    description: String
  }],
  // For graphics modules: transformation data
  graphicsData: {
    shapeType: {
      type: String,
      enum: ['line', 'circle', 'rectangle', 'polygon', 'triangle', 'custom']
    },
    defaultCoordinates: [{
      x: Number,
      y: Number
    }],
    transformations: [{
      type: {
        type: String,
        enum: ['translation', 'rotation', 'scaling', 'reflection', 'shearing']
      },
      parameters: mongoose.Schema.Types.Mixed
    }]
  },
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // Instructions/hints
  instructions: {
    type: String,
    trim: true
  },
  // Related video resources
  relatedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  // Usage statistics
  completionCount: {
    type: Number,
    default: 0
  },
  // Created by admin
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Status
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search (disable language feature to avoid conflict with our 'language' field)
codingModuleSchema.index({ title: 'text', description: 'text' }, { 
  default_language: 'none',
  language_override: 'textLanguage'
});
codingModuleSchema.index({ category: 1, type: 1, language: 1 });

module.exports = mongoose.model('CodingModule', codingModuleSchema);
