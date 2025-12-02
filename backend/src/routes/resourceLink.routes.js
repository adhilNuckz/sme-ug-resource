const express = require('express');
const router = express.Router();
const resourceLinkController = require('../controllers/resourceLink.controller');
const { verifyAuth, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/resource-links
 * @desc    Get all resource links with filtering
 * @access  Public
 */
router.get('/', resourceLinkController.getAllLinks);

/**
 * @route   GET /api/resource-links/:id
 * @desc    Get resource link by ID
 * @access  Public
 */
router.get('/:id', resourceLinkController.getLinkById);

/**
 * @route   POST /api/resource-links
 * @desc    Create new resource link
 * @access  Private (Admin only)
 */
router.post('/', verifyAuth, isAdmin, resourceLinkController.createLink);

/**
 * @route   PUT /api/resource-links/:id
 * @desc    Update resource link
 * @access  Private (Admin only)
 */
router.put('/:id', verifyAuth, isAdmin, resourceLinkController.updateLink);

/**
 * @route   DELETE /api/resource-links/:id
 * @desc    Delete resource link
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyAuth, isAdmin, resourceLinkController.deleteLink);

module.exports = router;
