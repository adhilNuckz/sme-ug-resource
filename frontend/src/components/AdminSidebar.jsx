import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiVideo, 
  FiCode, 
  FiLink,
  FiBarChart2,
  FiBox
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Dashboard' },
    { path: '/admin/students', icon: FiUsers, label: 'Students' },
    { path: '/admin/videos', icon: FiVideo, label: 'Videos' },
    { path: '/admin/coding-modules', icon: FiCode, label: 'Coding Modules' },
    { path: '/admin/resource-links', icon: FiLink, label: 'Resource Links' },
    { path: '/admin/graphics-simulations', icon: FiBox, label: 'Graphics Simulations' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-800 min-h-screen text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                active ? 'bg-gray-700 text-white border-l-4 border-primary-500' : ''
              }`}
            >
              <Icon className="mr-3" size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
