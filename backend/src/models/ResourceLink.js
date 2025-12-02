const mongoose = require('mongoose');

/**
 * Resource Link Schema
 * External resources like YouTube videos, PDFs, websites
 */
const resourceLinkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Resource type is required'],
    enum: ['youtube', 'pdf', 'website', 'documentation', 'tutorial', 'github', 'other']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'DSA',
      'Computer Graphics',
      'Computer Networks',
      'Cybersecurity',
      'Figma',
      'Excel',
      'Encryption Algorithms',
      'Web Development',
      'Database Management',
      'Operating Systems',
      'Software Engineering',
      'Other'
    ]
  },
  language: {
    type: String,
    required: [true, 'Language is required'],
    enum: ['tamil', 'sinhala', 'english', 'multilingual']
  },
  // Thumbnail or icon
  thumbnailUrl: {
    type: String,
    trim: true
  },
  // Topics covered
  topics: [{
    type: String,
    trim: true
  }],
  // Click count
  clicks: {
    type: Number,
    default: 0
  },
  // Added by admin
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for search (disable language feature to avoid conflict with our 'language' field)
resourceLinkSchema.index({ title: 'text', description: 'text', topics: 'text' }, { 
  default_language: 'none',
  language_override: 'textLanguage'
});
resourceLinkSchema.index({ category: 1, type: 1, language: 1 });

module.exports = mongoose.model('ResourceLink', resourceLinkSchema);
