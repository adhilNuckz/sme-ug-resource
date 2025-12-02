import api from './api';

/**
 * Authentication service
 */
export const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { user, accessToken, refreshToken } = response.data.data;
    
    // Store tokens and user data
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
};

/**
 * Video service
 */
export const videoService = {
  // Get all videos with filters
  getVideos: async (params) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  // Get video by ID
  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  // Get personalized recommendations
  getRecommendations: async (limit = 6) => {
    const response = await api.get('/videos/recommendations', { params: { limit } });
    return response.data;
  },

  // Create video (Admin)
  createVideo: async (videoData) => {
    const response = await api.post('/videos', videoData);
    return response.data;
  },

  // Update video (Admin)
  updateVideo: async (id, videoData) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },

  // Delete video (Admin)
  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

/**
 * Coding module service
 */
export const codingModuleService = {
  // Get all modules with filters
  getModules: async (params) => {
    const response = await api.get('/coding-modules', { params });
    return response.data;
  },

  // Get module by ID
  getModuleById: async (id) => {
    const response = await api.get(`/coding-modules/${id}`);
    return response.data;
  },

  // Create module (Admin)
  createModule: async (moduleData) => {
    const response = await api.post('/coding-modules', moduleData);
    return response.data;
  },

  // Update module (Admin)
  updateModule: async (id, moduleData) => {
    const response = await api.put(`/coding-modules/${id}`, moduleData);
    return response.data;
  },

  // Delete module (Admin)
  deleteModule: async (id) => {
    const response = await api.delete(`/coding-modules/${id}`);
    return response.data;
  },

  // Increment completion count
  completeModule: async (id) => {
    const response = await api.post(`/coding-modules/${id}/complete`);
    return response.data;
  },
};

/**
 * Resource link service
 */
export const resourceLinkService = {
  // Get all links with filters
  getLinks: async (params) => {
    const response = await api.get('/resource-links', { params });
    return response.data;
  },

  // Get link by ID
  getLinkById: async (id) => {
    const response = await api.get(`/resource-links/${id}`);
    return response.data;
  },

  // Create link (Admin)
  createLink: async (linkData) => {
    const response = await api.post('/resource-links', linkData);
    return response.data;
  },

  // Update link (Admin)
  updateLink: async (id, linkData) => {
    const response = await api.put(`/resource-links/${id}`, linkData);
    return response.data;
  },

  // Delete link (Admin)
  deleteLink: async (id) => {
    const response = await api.delete(`/resource-links/${id}`);
    return response.data;
  },
};

/**
 * Student service (Admin)
 */
export const studentService = {
  // Get all students
  getStudents: async (params) => {
    const response = await api.get('/students', { params });
    return response.data;
  },

  // Get student by ID
  getStudentById: async (id) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Update student
  updateStudent: async (id, studentData) => {
    const response = await api.put(`/students/${id}`, studentData);
    return response.data;
  },

  // Delete student
  deleteStudent: async (id) => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },
};

/**
 * Graphics Simulation service
 */
export { default as graphicsSimulationService } from './graphicsSimulationService';
