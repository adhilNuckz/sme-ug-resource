const ResourceLink = require('../models/ResourceLink');

/**
 * Get all resource links with filtering
 */
const getAllLinks = async (req, res) => {
  try {
    const { category, type, language, search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (language) query.language = language;
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const links = await ResourceLink.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await ResourceLink.countDocuments(query);

    res.json({
      success: true,
      data: {
        links,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        totalLinks: count
      }
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource links',
      error: error.message
    });
  }
};

/**
 * Get resource link by ID
 */
const getLinkById = async (req, res) => {
  try {
    const link = await ResourceLink.findById(req.params.id)
      .populate('addedBy', 'name email');

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Resource link not found'
      });
    }

    // Increment click count
    link.clicks += 1;
    await link.save();

    res.json({
      success: true,
      data: { link }
    });
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource link',
      error: error.message
    });
  }
};

/**
 * Create new resource link (Admin only)
 */
const createLink = async (req, res) => {
  try {
    const linkData = {
      ...req.body,
      addedBy: req.user._id
    };

    const link = await ResourceLink.create(linkData);

    res.status(201).json({
      success: true,
      message: 'Resource link created successfully',
      data: { link }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating resource link',
      error: error.message
    });
  }
};

/**
 * Update resource link (Admin only)
 */
const updateLink = async (req, res) => {
  try {
    const link = await ResourceLink.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Resource link not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource link updated successfully',
      data: { link }
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resource link',
      error: error.message
    });
  }
};

/**
 * Delete resource link (Admin only)
 */
const deleteLink = async (req, res) => {
  try {
    const link = await ResourceLink.findByIdAndDelete(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Resource link not found'
      });
    }

    res.json({
      success: true,
      message: 'Resource link deleted successfully'
    });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resource link',
      error: error.message
    });
  }
};

module.exports = {
  getAllLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink
};
