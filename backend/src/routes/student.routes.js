const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyAuth, isAdmin } = require('../middleware/auth');

/**
 * All routes require authentication and admin privileges
 */
router.use(verifyAuth, isAdmin);

/**
 * @route   GET /api/students/dashboard
 * @desc    Get dashboard statistics
 * @access  Private (Admin only)
 */
router.get('/dashboard', studentController.getDashboardStats);

/**
 * @route   GET /api/students
 * @desc    Get all students
 * @access  Private (Admin only)
 */
router.get('/', studentController.getAllStudents);

/**
 * @route   GET /api/students/:id
 * @desc    Get student by ID
 * @access  Private (Admin only)
 */
router.get('/:id', studentController.getStudentById);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student
 * @access  Private (Admin only)
 */
router.put('/:id', studentController.updateStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Private (Admin only)
 */
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
