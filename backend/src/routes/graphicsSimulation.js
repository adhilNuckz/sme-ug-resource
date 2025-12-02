const express = require('express');
const router = express.Router();
const graphicsSimulationController = require('../controllers/graphicsSimulationController');
const { verifyAuth, isAdmin } = require('../middleware/auth');

// Public routes (students can access)
router.get('/simulations', verifyAuth, graphicsSimulationController.getSimulations);
router.get('/simulations/topic/:topicId', verifyAuth, graphicsSimulationController.getSimulationByTopic);

// Admin-only routes
router.post('/simulations', verifyAuth, isAdmin, graphicsSimulationController.createSimulation);
router.put('/simulations/:id', verifyAuth, isAdmin, graphicsSimulationController.updateSimulation);
router.delete('/simulations/:id', verifyAuth, isAdmin, graphicsSimulationController.deleteSimulation);
router.patch('/simulations/:id/toggle', verifyAuth, isAdmin, graphicsSimulationController.toggleSimulationStatus);

module.exports = router;
