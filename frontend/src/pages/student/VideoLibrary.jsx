import { useEffect, useState } from 'react';
import StudentLayout from '../../components/StudentLayout';
import { videoService } from '../../services';
import { Link } from 'react-router-dom';
import { FiPlay, FiSearch, FiFilter, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const VideoLibrary = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    language: '',
    difficulty: '',
    search: ''
  });

  // Module structure by year
  const yearModules = {
    1: ['DSA', 'Computer Graphics', 'Computer Networks'],
    2: ['Cybersecurity', 'Database Management', 'Operating Systems'],
    3: ['Web Development', 'Software Engineering', 'Figma', 'Excel'],
    4: ['Encryption Algorithms', 'Advanced Topics', 'Project Management']
  };

  const categories = ['DSA', 'Computer Graphics', 'Computer Networks', 'Cybersecurity', 'Figma', 'Excel', 'Encryption Algorithms', 'Web Development', 'Database Management', 'Operating Systems', 'Software Engineering'];
  const languages = ['english', 'sinhala', 'tamil'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    fetchVideos();
  }, [filters, selectedModule, user]);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      // Build filter params
      const params = { ...filters };
      
      // Add module/category filter if selected
      if (selectedModule) {
        params.category = selectedModule;
      }
      
      // If no filters selected, get personalized recommendations based on user
      if (!params.category && !params.language && !params.difficulty && !params.search) {
        // Fetch based on user's preferred language and year
        if (user?.preferredLanguage) {
          params.language = user.preferredLanguage;
        }
      }

      const response = await videoService.getVideos(params);
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setSelectedYear(null);
    setSelectedModule('');
  };

  const handleYearClick = (year) => {
    if (expandedYear === year) {
      setExpandedYear(null);
    } else {
      setExpandedYear(year);
      setSelectedYear(year);
    }
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setFilters({
      category: '',
      language: '',
      difficulty: '',
      search: ''
    });
  };

  const clearAllFilters = () => {
    setFilters({
      category: '',
      language: '',
      difficulty: '',
      search: ''
    });
    setSelectedYear(null);
    setExpandedYear(null);
    setSelectedModule('');
  };

  return (
    <StudentLayout>
      <div className="flex gap-6">
        {/* Left Sidebar */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {t('videos')}
            </h1>

            {/* Search */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('search')}
              </label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search videos..."
                  className="input-field pl-10"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            {/* Language Filter */}
            <div className="card">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('language')}
              </label>
              <select
                className="input-field"
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Year & Module Selection */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                Browse by Year
              </h3>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((year) => (
                  <div key={year}>
                    <button
                      onClick={() => handleYearClick(year)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        selectedYear === year
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <span className="font-medium">Year {year}</span>
                      {expandedYear === year ? (
                        <FiChevronDown className="text-lg" />
                      ) : (
                        <FiChevronRight className="text-lg" />
                      )}
                    </button>
                    
                    {/* Modules dropdown */}
                    {expandedYear === year && (
                      <div className="mt-2 ml-4 space-y-1">
                        {yearModules[year].map((module) => (
                          <button
                            key={module}
                            onClick={() => handleModuleClick(module)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              selectedModule === module
                                ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                          >
                            {module}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedModule || filters.language || filters.search) && (
              <button
                onClick={clearAllFilters}
                className="w-full btn-secondary text-sm"
              >
                Clear All Filters
              </button>
            )}

            {/* Active Filters Display */}
            {(selectedModule || selectedYear) && (
              <div className="card bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Active Selection:
                </p>
                {selectedYear && (
                  <p className="text-sm text-primary-700 dark:text-primary-300">
                    📚 Year {selectedYear}
                  </p>
                )}
                {selectedModule && (
                  <p className="text-sm text-primary-700 dark:text-primary-300 font-semibold">
                    📖 {selectedModule}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Header Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {selectedModule
                ? `${selectedModule} Videos`
                : selectedYear
                ? `Year ${selectedYear} Videos`
                : user?.preferredLanguage
                ? 'Recommended Videos for You'
                : 'All Videos'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {videos.length} video{videos.length !== 1 ? 's' : ''} found
              {!selectedModule && !selectedYear && !filters.category && !filters.search && 
                ' - Showing personalized content based on your profile'}
            </p>
          </div>

          {/* Video Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-xl">{t('loading')}</div>
            </div>
          ) : videos.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No videos found matching your criteria.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
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
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                      {Math.floor((video.duration || 0) / 60)} min
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                      {video.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 flex items-center">
                      <FiPlay className="mr-1" />
                      {video.views} {t('views')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default VideoLibrary;
