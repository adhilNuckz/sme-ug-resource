import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiLoader, FiSearch, FiFilter } from 'react-icons/fi';
import { toast } from 'react-toastify';
import graphicsSimulationService from '../../services/graphicsSimulationService';
import SimulationFormModal from '../../components/admin/SimulationFormModal';

const GraphicsSimulationsManagement = () => {
  const [simulations, setSimulations] = useState([]);
  const [filteredSimulations, setFilteredSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dimensionFilter, setDimensionFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSimulation, setEditingSimulation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  useEffect(() => {
    filterSimulations();
  }, [simulations, searchTerm, dimensionFilter, difficultyFilter]);

  const fetchSimulations = async () => {
    try {
      setLoading(true);
      const response = await graphicsSimulationService.getSimulations({ isActive: undefined });
      setSimulations(response.data || []);
    } catch (error) {
      toast.error('Failed to load simulations');
      console.error('Error fetching simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSimulations = () => {
    let filtered = [...simulations];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sim => 
        sim.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sim.topicId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Dimension filter
    if (dimensionFilter !== 'all') {
      filtered = filtered.filter(sim => sim.dimension === dimensionFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(sim => sim.difficulty === difficultyFilter);
    }

    setFilteredSimulations(filtered);
  };

  const handleCreate = () => {
    setEditingSimulation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (simulation) => {
    setEditingSimulation(simulation);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await graphicsSimulationService.deleteSimulation(id);
      toast.success('Simulation deleted successfully');
      fetchSimulations();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete simulation');
    }
  };

  const handleToggleStatus = async (simulation) => {
    try {
      await graphicsSimulationService.toggleSimulationStatus(simulation._id);
      toast.success(`Simulation ${simulation.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchSimulations();
    } catch (error) {
      toast.error('Failed to toggle simulation status');
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setEditingSimulation(null);
    if (shouldRefresh) {
      fetchSimulations();
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[difficulty] || colors.beginner;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FiLoader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Graphics Simulations Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage code templates, simulations, and learning materials for Computer Graphics
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search simulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-600 dark:text-gray-400" />
              <select
                value={dimensionFilter}
                onChange={(e) => setDimensionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Dimensions</option>
                <option value="2d">2D</option>
                <option value="3d">3D</option>
              </select>
            </div>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            {/* Create Button */}
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Create Simulation
            </button>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredSimulations.length} of {simulations.length} simulations
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Topic ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Dimension
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSimulations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No simulations found
                  </td>
                </tr>
              ) : (
                filteredSimulations.map((simulation) => (
                  <tr key={simulation._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">
                      {simulation.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{simulation.icon}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {simulation.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {simulation.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {simulation.topicId}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 uppercase">
                        {simulation.dimension}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(simulation.difficulty)} capitalize`}>
                        {simulation.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(simulation)}
                        className="flex items-center gap-1 text-sm"
                      >
                        {simulation.isActive ? (
                          <>
                            <FiToggleRight className="w-5 h-5 text-green-600" />
                            <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <FiToggleLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-500 dark:text-gray-400">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(simulation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(simulation._id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Simulation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this simulation? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <SimulationFormModal
          simulation={editingSimulation}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default GraphicsSimulationsManagement;
