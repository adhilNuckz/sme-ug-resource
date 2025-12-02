import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation object for the system
const translations = {
  english: {
    welcome: 'Welcome to Campus Resource Platform',
    welcomeDesc: 'Access video tutorials, interactive coding environments, and learning resources in Tamil, Sinhala, and English.',
    recommendedForYou: 'Recommended for You',
    viewAllVideos: 'View All Videos',
    practiceCoding: 'Practice Coding',
    viewAllModules: 'View All Modules',
    home: 'Home',
    videos: 'Videos',
    codingLab: 'Coding Lab',
    graphicsLab: 'Graphics Lab',
    logout: 'Logout',
    admin: 'Admin',
    search: 'Search',
    courses: 'Courses',
    views: 'views',
    loading: 'Loading...',
    category: 'Category',
    difficulty: 'Difficulty',
    language: 'Language',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
  },
  tamil: {
    welcome: 'கேம்பஸ் ரிசோர்ஸ் பிளாட்ஃபார்முக்கு வரவேற்கிறோம்',
    welcomeDesc: 'தமிழ், சிங்களம் மற்றும் ஆங்கிலத்தில் வீடியோ டுடோரியல்கள், ஊடாடும் கோடிங் சூழல்கள் மற்றும் கற்றல் ஆதாரங்களை அணுகவும்.',
    recommendedForYou: 'உங்களுக்கான பரிந்துரைகள்',
    viewAllVideos: 'அனைத்து வீடியோக்களையும் காண்க',
    practiceCoding: 'கோடிங் பயிற்சி',
    viewAllModules: 'அனைத்து தொகுதிகளையும் காண்க',
    home: 'முகப்பு',
    videos: 'வீடியோக்கள்',
    codingLab: 'கோடிங் ஆய்வகம்',
    graphicsLab: 'கிராபிக்ஸ் ஆய்வகம்',
    logout: 'வெளியேறு',
    admin: 'நிர்வாகி',
    search: 'தேடு',
    courses: 'பாடநெறிகள்',
    views: 'பார்வைகள்',
    loading: 'ஏற்றுகிறது...',
    category: 'வகை',
    difficulty: 'சிரமம்',
    language: 'மொழி',
    darkMode: 'இருள் முறை',
    lightMode: 'வெளிச்ச முறை',
  },
  sinhala: {
    welcome: 'කැම්පස් සම්පත් වේදිකාවට සාදරයෙන් පිළිගනිමු',
    welcomeDesc: 'දෙමළ, සිංහල සහ ඉංග්‍රීසි භාෂාවෙන් වීඩියෝ නිබන්ධන, අන්තර්ක්‍රියාකාරී කේතීකරණ පරිසර සහ ඉගෙනුම් සම්පත් වෙත ප්‍රවේශ වන්න.',
    recommendedForYou: 'ඔබට නිර්දේශිත',
    viewAllVideos: 'සියලුම වීඩියෝ බලන්න',
    practiceCoding: 'කේතීකරණ පුහුණුව',
    viewAllModules: 'සියලුම මොඩියුල බලන්න',
    home: 'මුල් පිටුව',
    videos: 'වීඩියෝ',
    codingLab: 'කේතීකරණ විද්‍යාගාරය',
    graphicsLab: 'ග්‍රැෆික්ස් විද්‍යාගාරය',
    logout: 'ඉවත් වන්න',
    admin: 'පරිපාලක',
    search: 'සොයන්න',
    courses: 'පාඨමාලා',
    views: 'දැක්ම',
    loading: 'පූරණය වෙමින්...',
    category: 'කාණ්ඩය',
    difficulty: 'දුෂ්කරතාව',
    language: 'භාෂාව',
    darkMode: 'අඳුරු ප්‍රකාරය',
    lightMode: 'ආලෝක ප්‍රකාරය',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'english';
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    // Update user's preferred language in backend if logged in
    // You can add API call here to update user preferences
  }, [language]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      changeLanguage, 
      t, 
      isDarkMode, 
      toggleDarkMode 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
