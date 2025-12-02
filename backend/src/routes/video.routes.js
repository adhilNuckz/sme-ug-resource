const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller');
const { verifyAuth, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/videos
 * @desc    Get all videos with filtering
 * @access  Public
 */
router.get('/', videoController.getAllVideos);

/**
 * @route   GET /api/videos/recommendations
 * @desc    Get personalized video recommendations
 * @access  Private
 */
router.get('/recommendations', verifyAuth, videoController.getRecommendations);

/**
 * @route   GET /api/videos/:id
 * @desc    Get video by ID
 * @access  Public
 */
router.get('/:id', videoController.getVideoById);

/**
 * @route   POST /api/videos
 * @desc    Create new video
 * @access  Private (Admin only)
 */
router.post('/', verifyAuth, isAdmin, videoController.createVideo);

/**
 * @route   PUT /api/videos/:id
 * @desc    Update video
 * @access  Private (Admin only)
 */
router.put('/:id', verifyAuth, isAdmin, videoController.updateVideo);

/**
 * @route   DELETE /api/videos/:id
 * @desc    Delete video
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyAuth, isAdmin, videoController.deleteVideo);

module.exports = router;
