import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { resourceLinkService } from '../../services';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';

const ResourceLinkManagement = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await resourceLinkService.getLinks({ limit: 100 });
      setLinks(response.data.links || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource link?')) {
      try {
        await resourceLinkService.deleteLink(id);
        fetchLinks();
      } catch (error) {
        console.error('Error deleting link:', error);
        alert('Failed to delete link');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Resource Link Management</h1>
          <button className="btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Add Link
          </button>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {links.map((link) => (
                    <tr key={link._id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <FiExternalLink className="mr-2 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{link.title}</div>
                            <div className="text-sm text-gray-500">{link.description.substring(0, 50)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          {link.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{link.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{link.clicks}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-900 mr-3">
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ResourceLinkManagement;
