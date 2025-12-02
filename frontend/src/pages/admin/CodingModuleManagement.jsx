import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { codingModuleService } from '../../services';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import CodingModuleFormModal from '../../components/admin/CodingModuleFormModal';

const CodingModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    filterModules();
  }, [modules, searchTerm, categoryFilter, typeFilter]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await codingModuleService.getModules({ limit: 1000, isPublished: undefined });
      setModules(response.data.modules || []);
    } catch (error) {
      toast.error('Failed to load modules');
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterModules = () => {
    let filtered = [...modules];

    if (searchTerm) {
      filtered = filtered.filter(mod => 
        mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(mod => mod.category === categoryFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(mod => mod.type === typeFilter);
    }

    setFilteredModules(filtered);
  };

  const handleCreate = () => {
    setEditingModule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (module) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await codingModuleService.deleteModule(id);
      toast.success('Module deleted successfully');
      fetchModules();
      setDeleteConfirm(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete module');
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setIsModalOpen(false);
    setEditingModule(null);
    if (shouldRefresh) {
      fetchModules();
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Coding Module Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage coding exercises, simulations, and programming challenges
            </p>
          </div>
          <button 
            onClick={handleCreate}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus />
            Add Module
          </button>
        </div>

        {/* Filters */}
        <div className="card p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-3 items-center flex-wrap">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-600 dark:text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="DSA">DSA</option>
                  <option value="Computer Graphics">Computer Graphics</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Encryption Algorithms">Encryption Algorithms</option>
                  <option value="Sorting Algorithms">Sorting Algorithms</option>
                  <option value="Graph Algorithms">Graph Algorithms</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="coding">Coding</option>
                <option value="simulation">Simulation</option>
                <option value="visualization">Visualization</option>
              </select>
            </div>
          </div>

          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredModules.length} of {modules.length} modules
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Language
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
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredModules.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No modules found
                    </td>
                  </tr>
                ) : (
                  filteredModules.map((module) => (
                    <tr key={module._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">{module.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {module.description}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {module.programmingLanguage?.toUpperCase() || 'JS'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                          {module.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 capitalize">
                          {module.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-700 dark:text-gray-300">
                        {module.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyBadge(module.difficulty)} capitalize`}>
                          {module.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {module.isPublished ? (
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <FiToggleRight className="w-5 h-5" />
                            <span className="text-sm font-medium">Published</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <FiToggleLeft className="w-5 h-5" />
                            <span className="text-sm">Draft</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(module)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(module._id)}
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Module
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this module? This action cannot be undone.
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
        <CodingModuleFormModal
          module={editingModule}
          onClose={handleModalClose}
        />
      )}
    </AdminLayout>
  );
};

export default CodingModuleManagement;
