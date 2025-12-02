import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/student/Home';
import VideoLibrary from './pages/student/VideoLibrary';
import VideoViewer from './pages/student/VideoViewer';
import CodingPlayground from './pages/student/CodingPlayground';
import GraphicsSimulation from './pages/student/GraphicsSimulation';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import StudentManagement from './pages/admin/StudentManagement';
import VideoManagement from './pages/admin/VideoManagement';
import CodingModuleManagement from './pages/admin/CodingModuleManagement';
import ResourceLinkManagement from './pages/admin/ResourceLinkManagement';
import GraphicsSimulationsManagement from './pages/admin/GraphicsSimulationsManagement';

// Components
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/videos" element={<PrivateRoute><VideoLibrary /></PrivateRoute>} />
          <Route path="/videos/:id" element={<PrivateRoute><VideoViewer /></PrivateRoute>} />
          <Route path="/coding" element={<PrivateRoute><CodingPlayground /></PrivateRoute>} />
          <Route path="/coding/:id" element={<PrivateRoute><CodingPlayground /></PrivateRoute>} />
          <Route path="/graphics" element={<PrivateRoute><GraphicsSimulation /></PrivateRoute>} />
          <Route path="/graphics/:id" element={<PrivateRoute><GraphicsSimulation /></PrivateRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/students" element={<AdminRoute><StudentManagement /></AdminRoute>} />
          <Route path="/admin/videos" element={<AdminRoute><VideoManagement /></AdminRoute>} />
          <Route path="/admin/coding-modules" element={<AdminRoute><CodingModuleManagement /></AdminRoute>} />
          <Route path="/admin/resource-links" element={<AdminRoute><ResourceLinkManagement /></AdminRoute>} />
          <Route path="/admin/graphics-simulations" element={<AdminRoute><GraphicsSimulationsManagement /></AdminRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
