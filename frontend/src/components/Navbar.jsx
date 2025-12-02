import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FiLogOut, FiUser, FiHome, FiVideo, FiCode, FiSettings, FiMoon, FiSun, FiGlobe } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { language, changeLanguage, t, isDarkMode, toggleDarkMode } = useLanguage();
  const navigate = useNavigate();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const languages = [
    { code: 'english', label: 'English', flag: '🇬🇧' },
    { code: 'tamil', label: 'தமிழ்', flag: '🇮🇳' },
    { code: 'sinhala', label: 'සිංහල', flag: '🇱🇰' }
  ];

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-primary-600">
                Campus Resource
              </div>
            </Link>

            <div className="hidden md:flex ml-10 space-x-8">
              {!isAdmin && (
                <>
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                  >
                    <FiHome className="mr-2" />
                    {t('home')}
                  </Link>
                  <Link
                    to="/videos"
                    className="inline-flex items-center px-1 pt-1 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                  >
                    <FiVideo className="mr-2" />
                    {t('videos')}
                  </Link>
                  <Link
                    to="/coding"
                    className="inline-flex items-center px-1 pt-1 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                  >
                    <FiCode className="mr-2" />
                    {t('codingLab')}
                  </Link>
                  <Link
                    to="/graphics"
                    className="inline-flex items-center px-1 pt-1 text-gray-700 dark:text-gray-200 hover:text-primary-600"
                  >
                    <FiSettings className="mr-2" />
                    {t('graphicsLab')}
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiGlobe className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {languages.find(l => l.code === language)?.flag}
                </span>
              </button>
              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center space-x-2 ${
                        language === lang.code ? 'bg-primary-50 dark:bg-primary-900 text-primary-600' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? t('lightMode') : t('darkMode')}
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-500 text-xl" />
              ) : (
                <FiMoon className="text-gray-600 text-xl" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <FiUser className="text-gray-600 dark:text-gray-300" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name}
              </span>
              {isAdmin && (
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-primary-600 rounded">
                  {t('admin')}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <FiLogOut className="mr-2" />
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
