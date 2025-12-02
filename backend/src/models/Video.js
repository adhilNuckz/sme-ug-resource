const mongoose = require('mongoose');

/**
 * Video Schema
 * Stores learning video resources in multiple languages
 */
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Video description is required'],
    trim: true
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
    enum: ['tamil', 'sinhala', 'english']
  },
  // Video URL (can be YouTube, Vimeo, or internal storage)
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  // Thumbnail image URL
  thumbnailUrl: {
    type: String,
    trim: true
  },
  // Duration in seconds
  duration: {
    type: Number,
    min: 0
  },
  // Difficulty level
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  // Topics covered in the video
  topics: [{
    type: String,
    trim: true
  }],
  // View count
  views: {
    type: Number,
    default: 0
  },
  // Downloadable materials
  downloadableFiles: [{
    fileName: String,
    fileUrl: String,
    fileType: String // pdf, zip, etc.
  }],
  // External resource links
  externalLinks: [{
    title: String,
    url: String,
    type: String // youtube, pdf, website, etc.
  }],
  // Who uploaded this video
  uploadedBy: {
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

// Index for search and filtering (disable language feature to avoid conflict with our 'language' field)
videoSchema.index({ title: 'text', description: 'text', topics: 'text' }, { 
  default_language: 'none',
  language_override: 'textLanguage'  // Use different field name for text search language
});
videoSchema.index({ category: 1, language: 1 });

module.exports = mongoose.model('Video', videoSchema);
