import api from './api';

const graphicsSimulationService = {
  // Get all simulations
  getSimulations: async (params = {}) => {
    const response = await api.get('/graphics/simulations', { params });
    return response.data;
  },

  // Get simulation by topic ID
  getSimulationByTopic: async (topicId) => {
    const response = await api.get(`/graphics/simulations/topic/${topicId}`);
    return response.data;
  },

  // Admin: Create simulation
  createSimulation: async (data) => {
    const response = await api.post('/graphics/simulations', data);
    return response.data;
  },

  // Admin: Update simulation
  updateSimulation: async (id, data) => {
    const response = await api.put(`/graphics/simulations/${id}`, data);
    return response.data;
  },

  // Admin: Delete simulation
  deleteSimulation: async (id) => {
    const response = await api.delete(`/graphics/simulations/${id}`);
    return response.data;
  },

  // Admin: Toggle simulation status
  toggleSimulationStatus: async (id) => {
    const response = await api.patch(`/graphics/simulations/${id}/toggle`);
    return response.data;
  }
};

export default graphicsSimulationService;
