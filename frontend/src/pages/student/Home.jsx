import { useEffect, useState } from 'react';
import StudentLayout from '../../components/StudentLayout';
import { videoService, codingModuleService } from '../../services';
import { Link } from 'react-router-dom';
import { FiVideo, FiCode, FiTrendingUp, FiPlay, FiSearch, FiBook, FiChevronDown } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';

const Home = () => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [recentModules, setRecentModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);

  const categories = [
    'DSA', 'Computer Graphics', 'Computer Networks', 'Cybersecurity', 
    'Figma', 'Excel', 'Encryption Algorithms', 'Web Development', 
    'Database Management', 'Operating Systems', 'Software Engineering'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [videosRes, modulesRes] = await Promise.all([
        videoService.getRecommendations(6),
        codingModuleService.getModules({ limit: 4 })
      ]);

      setRecommendations(videosRes.data.recommendations || []);
      setRecentModules(modulesRes.data.modules || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/videos?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">{t('loading')}</div>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="space-y-8">
        {/* Welcome Section with Search and Courses */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg p-8 text-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
              <p className="text-primary-100">
                {t('welcomeDesc')}
              </p>
            </div>
            
            {/* Right side: Search and Courses Dropdown */}
            <div className="flex items-center space-x-3 ml-4">
              {/* Search Button */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={t('search')}
                  className="pl-10 pr-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 w-64"
                />
                <FiSearch 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 cursor-pointer"
                  onClick={handleSearch}
                />
              </div>

              {/* Courses Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCoursesDropdown(!showCoursesDropdown)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  <FiBook className="text-white" />
                  <span className="text-white font-medium">{t('courses')}</span>
                  <FiChevronDown className="text-white" />
                </button>
                {showCoursesDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        to={`/videos?category=${encodeURIComponent(category)}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        onClick={() => setShowCoursesDropdown(false)}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Videos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('recommendedForYou')}</h2>
            <Link to="/videos" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('viewAllVideos')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((video) => (
              <Link
                key={video._id}
                to={`/videos/${video._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={video.thumbnailUrl || 'https://via.placeholder.com/400x225?text=Video'}
                    alt={video.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {video.language}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
                    {video.category}
                  </span>
                  <span className="text-gray-500 flex items-center">
                    <FiPlay className="mr-1" />
                    {video.views} {t('views')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Coding Modules */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('practiceCoding')}</h2>
            <Link to="/coding" className="text-primary-600 hover:text-primary-700 font-medium">
              {t('viewAllModules')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentModules.map((module) => (
              <Link
                key={module._id}
                to={`/coding/${module._id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <FiCode className="text-2xl text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{module.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {module.category}
                      </span>
                      <span className="text-gray-500">
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default Home;
