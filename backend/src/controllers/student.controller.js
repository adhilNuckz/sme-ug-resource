const User = require('../models/User');

/**
 * Get all students (Admin only)
 */
const getAllStudents = async (req, res) => {
  try {
    const { department, yearOfStudy, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { role: 'student' };

    if (department) query.department = department;
    if (yearOfStudy) query.yearOfStudy = parseInt(yearOfStudy);
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const students = await User.find(query)
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        students,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalStudents: count
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

/**
 * Get student by ID (Admin only)
 */
const getStudentById = async (req, res) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' })
      .select('-password -refreshToken');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      data: { student }
    });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student',
      error: error.message
    });
  }
};

/**
 * Update student (Admin only)
 */
const updateStudent = async (req, res) => {
  try {
    // Don't allow password update through this endpoint
    const { password, role, refreshToken, ...updateData } = req.body;

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'student' },
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { student }
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating student',
      error: error.message
    });
  }
};

/**
 * Delete student (Admin only)
 */
const deleteStudent = async (req, res) => {
  try {
    const student = await User.findOneAndDelete({ _id: req.params.id, role: 'student' });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting student',
      error: error.message
    });
  }
};

/**
 * Get dashboard statistics (Admin only)
 */
const getDashboardStats = async (req, res) => {
  try {
    const Video = require('../models/Video');
    const CodingModule = require('../models/CodingModule');
    const ResourceLink = require('../models/ResourceLink');

    const [
      totalStudents,
      totalVideos,
      totalModules,
      totalLinks,
      recentStudents
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Video.countDocuments({ isPublished: true }),
      CodingModule.countDocuments({ isPublished: true }),
      ResourceLink.countDocuments({ isActive: true }),
      User.find({ role: 'student' })
        .select('-password -refreshToken')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalVideos,
        totalModules,
        totalLinks,
        recentStudents
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getDashboardStats
};
