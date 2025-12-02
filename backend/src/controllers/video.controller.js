const Video = require('../models/Video');

/**
 * Get all videos with filtering and search
 */
const getAllVideos = async (req, res) => {
  try {
    const { category, language, difficulty, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const videos = await Video.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Video.countDocuments(query);

    res.json({
      success: true,
      data: {
        videos,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalVideos: count
      }
    });
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
};

/**
 * Get video by ID
 */
const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate('uploadedBy', 'name email');

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    // Increment view count
    video.views += 1;
    await video.save();

    res.json({
      success: true,
      data: { video }
    });
  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching video',
      error: error.message
    });
  }
};

/**
 * Create new video (Admin only)
 */
const createVideo = async (req, res) => {
  try {
    const videoData = {
      ...req.body,
      uploadedBy: req.user._id
    };

    const video = await Video.create(videoData);

    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: { video }
    });
  } catch (error) {
    console.error('Create video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating video',
      error: error.message
    });
  }
};

/**
 * Update video (Admin only)
 */
const updateVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      message: 'Video updated successfully',
      data: { video }
    });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating video',
      error: error.message
    });
  }
};

/**
 * Delete video (Admin only)
 */
const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting video',
      error: error.message
    });
  }
};

/**
 * Get video recommendations based on user preferences
 */
const getRecommendations = async (req, res) => {
  try {
    const user = req.user;
    const limit = parseInt(req.query.limit) || 6;

    // Get videos in user's preferred language
    const recommendations = await Video.find({
      language: user.preferredLanguage,
      isPublished: true
    })
      .populate('uploadedBy', 'name')
      .sort({ views: -1, createdAt: -1 })
      .limit(limit);

    res.json({
      success: true,
      data: { recommendations }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommendations',
      error: error.message
    });
  }
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getRecommendations
};
