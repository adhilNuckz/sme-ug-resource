const GraphicsSimulation = require('../models/GraphicsSimulation');

/**
 * Get all graphics simulations
 */
exports.getSimulations = async (req, res) => {
  try {
    const { dimension, language, isActive = true } = req.query;
    
    const query = {};
    if (dimension) query.dimension = dimension;
    if (language) query.language = language;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const simulations = await GraphicsSimulation.find(query)
      .sort({ order: 1, createdAt: 1 })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.json({
      success: true,
      data: simulations
    });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching simulations',
      error: error.message
    });
  }
};

/**
 * Get single simulation by topic ID
 */
exports.getSimulationByTopic = async (req, res) => {
  try {
    const { topicId } = req.params;

    const simulation = await GraphicsSimulation.findOne({ topicId, isActive: true })
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    res.json({
      success: true,
      data: simulation
    });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching simulation',
      error: error.message
    });
  }
};

/**
 * Create new simulation (Admin only)
 */
exports.createSimulation = async (req, res) => {
  try {
    const simulationData = {
      ...req.body,
      createdBy: req.user.id
    };

    const simulation = await GraphicsSimulation.create(simulationData);

    res.status(201).json({
      success: true,
      message: 'Simulation created successfully',
      data: simulation
    });
  } catch (error) {
    console.error('Create simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating simulation',
      error: error.message
    });
  }
};

/**
 * Update simulation (Admin only)
 */
exports.updateSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const simulation = await GraphicsSimulation.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    res.json({
      success: true,
      message: 'Simulation updated successfully',
      data: simulation
    });
  } catch (error) {
    console.error('Update simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating simulation',
      error: error.message
    });
  }
};

/**
 * Delete simulation (Admin only)
 */
exports.deleteSimulation = async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = await GraphicsSimulation.findByIdAndDelete(id);

    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    res.json({
      success: true,
      message: 'Simulation deleted successfully'
    });
  } catch (error) {
    console.error('Delete simulation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting simulation',
      error: error.message
    });
  }
};

/**
 * Toggle simulation active status (Admin only)
 */
exports.toggleSimulationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const simulation = await GraphicsSimulation.findById(id);
    
    if (!simulation) {
      return res.status(404).json({
        success: false,
        message: 'Simulation not found'
      });
    }

    simulation.isActive = !simulation.isActive;
    simulation.updatedBy = req.user.id;
    await simulation.save();

    res.json({
      success: true,
      message: `Simulation ${simulation.isActive ? 'activated' : 'deactivated'} successfully`,
      data: simulation
    });
  } catch (error) {
    console.error('Toggle simulation status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling simulation status',
      error: error.message
    });
  }
};
