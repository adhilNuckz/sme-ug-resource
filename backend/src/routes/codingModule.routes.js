const express = require('express');
const router = express.Router();
const codingModuleController = require('../controllers/codingModule.controller');
const { verifyAuth, isAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/coding-modules
 * @desc    Get all coding modules with filtering
 * @access  Public
 */
router.get('/', codingModuleController.getAllModules);

/**
 * @route   GET /api/coding-modules/:id
 * @desc    Get coding module by ID
 * @access  Public
 */
router.get('/:id', codingModuleController.getModuleById);

/**
 * @route   POST /api/coding-modules
 * @desc    Create new coding module
 * @access  Private (Admin only)
 */
router.post('/', verifyAuth, isAdmin, codingModuleController.createModule);

/**
 * @route   PUT /api/coding-modules/:id
 * @desc    Update coding module
 * @access  Private (Admin only)
 */
router.put('/:id', verifyAuth, isAdmin, codingModuleController.updateModule);

/**
 * @route   DELETE /api/coding-modules/:id
 * @desc    Delete coding module
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyAuth, isAdmin, codingModuleController.deleteModule);

/**
 * @route   POST /api/coding-modules/:id/complete
 * @desc    Increment completion count
 * @access  Private
 */
router.post('/:id/complete', verifyAuth, codingModuleController.incrementCompletion);

module.exports = router;
