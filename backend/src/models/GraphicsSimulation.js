const mongoose = require('mongoose');

/**
 * Graphics Simulation Schema
 * Stores interactive computer graphics transformations with code templates
 */
const graphicsSimulationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Simulation title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  topicId: {
    type: String,
    required: [true, 'Topic ID is required'],
    unique: true,
    enum: [
      'translation',
      'scaling',
      'rotation',
      'shearing',
      'translation3d',
      'rotation3d',
      'scaling3d'
    ]
  },
  dimension: {
    type: String,
    required: true,
    enum: ['2d', '3d']
  },
  category: {
    type: String,
    default: 'Computer Graphics',
    enum: ['Computer Graphics']
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['tamil', 'sinhala', 'english']
  },
  icon: {
    type: String,
    default: '🎨'
  },
  // Complete code template with imports
  codeTemplate: {
    type: String,
    required: [true, 'Code template is required']
  },
  // Instructions for students
  instructions: {
    type: String,
    trim: true
  },
  // Variable parameters that students can modify
  editableVariables: [{
    name: { type: String },
    type: { type: String }, // 'number', 'boolean', etc.
    defaultValue: { type: mongoose.Schema.Types.Mixed },
    min: { type: Number },
    max: { type: Number },
    description: { type: String }
  }],
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // Order for display
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
graphicsSimulationSchema.index({ topicId: 1 });
graphicsSimulationSchema.index({ dimension: 1 });
graphicsSimulationSchema.index({ isActive: 1 });
graphicsSimulationSchema.index({ order: 1 });

// Text search index
graphicsSimulationSchema.index(
  { title: 'text', description: 'text' },
  { default_language: 'none', language_override: 'textLanguage' }
);

const GraphicsSimulation = mongoose.model('GraphicsSimulation', graphicsSimulationSchema);

module.exports = GraphicsSimulation;
