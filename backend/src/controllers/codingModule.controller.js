const CodingModule = require('../models/CodingModule');

/**
 * Get all coding modules with filtering
 */
const getAllModules = async (req, res) => {
  try {
    const { category, type, language, difficulty, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isPublished: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (language) query.language = language;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const modules = await CodingModule.find(query)
      .populate('createdBy', 'name email')
      .populate('relatedVideos', 'title thumbnailUrl')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await CodingModule.countDocuments(query);

    res.json({
      success: true,
      data: {
        modules,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalModules: count
      }
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coding modules',
      error: error.message
    });
  }
};

/**
 * Get coding module by ID
 */
const getModuleById = async (req, res) => {
  try {
    const module = await CodingModule.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('relatedVideos', 'title thumbnailUrl videoUrl');

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Coding module not found'
      });
    }

    res.json({
      success: true,
      data: { module }
    });
  } catch (error) {
    console.error('Get module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching coding module',
      error: error.message
    });
  }
};

/**
 * Create new coding module (Admin only)
 */
const createModule = async (req, res) => {
  try {
    const moduleData = {
      ...req.body,
      createdBy: req.user._id
    };

    const module = await CodingModule.create(moduleData);

    res.status(201).json({
      success: true,
      message: 'Coding module created successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating coding module',
      error: error.message
    });
  }
};

/**
 * Update coding module (Admin only)
 */
const updateModule = async (req, res) => {
  try {
    const module = await CodingModule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Coding module not found'
      });
    }

    res.json({
      success: true,
      message: 'Coding module updated successfully',
      data: { module }
    });
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating coding module',
      error: error.message
    });
  }
};

/**
 * Delete coding module (Admin only)
 */
const deleteModule = async (req, res) => {
  try {
    const module = await CodingModule.findByIdAndDelete(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Coding module not found'
      });
    }

    res.json({
      success: true,
      message: 'Coding module deleted successfully'
    });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting coding module',
      error: error.message
    });
  }
};

/**
 * Increment completion count
 */
const incrementCompletion = async (req, res) => {
  try {
    const module = await CodingModule.findById(req.params.id);

    if (!module) {
      return res.status(404).json({
        success: false,
        message: 'Coding module not found'
      });
    }

    module.completionCount += 1;
    await module.save();

    res.json({
      success: true,
      message: 'Completion count updated'
    });
  } catch (error) {
    console.error('Increment completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating completion count',
      error: error.message
    });
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  incrementCompletion
};
