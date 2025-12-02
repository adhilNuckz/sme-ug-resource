# Campus Resource Platform

A comprehensive educational platform for Sri Lankan students with multilingual support (Tamil, Sinhala, English).

## 🌟 Features

### For Students
- **Video Learning**: Browse and watch educational videos in multiple languages
- **Coding Playground**: Interactive coding environment with Monaco Editor
- **Graphics Simulation**: Visualize 2D graphics transformations
- **Personalized Recommendations**: Content based on language preference
- **Resource Links**: External learning materials

### For Admins
- **Dashboard**: Overview of platform statistics
- **Student Management**: View and manage student accounts
- **Video Management**: Full CRUD operations for videos
- **Coding Module Management**: Manage interactive coding exercises
- **Resource Link Management**: Manage external learning resources

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express.js**: Server framework
- **MongoDB** + **Mongoose**: Database
- **JWT**: Authentication (access + refresh tokens)
- **bcryptjs**: Password hashing

### Frontend
- **React 18**: UI library
- **Vite**: Build tool
- **React Router v6**: Navigation
- **Tailwind CSS**: Styling
- **Monaco Editor**: Code editor
- **Axios**: HTTP client
- **React Icons**: Icon library

## 📁 Project Structure

```
campus resource project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── video.controller.js
│   │   │   ├── codingModule.controller.js
│   │   │   ├── resourceLink.controller.js
│   │   │   └── student.controller.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Video.js
│   │   │   ├── CodingModule.js
│   │   │   └── ResourceLink.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── video.routes.js
│   │   │   ├── codingModule.routes.js
│   │   │   ├── resourceLink.routes.js
│   │   │   └── student.routes.js
│   │   ├── seeders/
│   │   │   └── seed.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   └── server.js
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AdminLayout.jsx
    │   │   ├── AdminRoute.jsx
    │   │   ├── AdminSidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── StudentLayout.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── CodingModuleManagement.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── ResourceLinkManagement.jsx
    │   │   │   ├── StudentManagement.jsx
    │   │   │   └── VideoManagement.jsx
    │   │   ├── student/
    │   │   │   ├── CodingPlayground.jsx
    │   │   │   ├── GraphicsSimulation.jsx
    │   │   │   ├── Home.jsx
    │   │   │   ├── VideoLibrary.jsx
    │   │   │   └── VideoViewer.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   └── index.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   copy .env.example .env
   ```

4. **Update `.env` file with your configuration:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/campus_resource_db
   JWT_ACCESS_SECRET=your_access_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   JWT_ACCESS_EXPIRE=15m
   JWT_REFRESH_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start MongoDB** (if using local MongoDB)

6. **Seed the database:**
   ```bash
   npm run seed
   ```

7. **Start the server:**
   ```bash
   npm run dev
   ```

   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## 🔑 Default Credentials

After seeding the database, use these credentials:

### Admin Account
- **Email**: admin@campus.lk
- **Password**: admin123

### Student Accounts
- **Email**: ravindu@student.lk | **Password**: student123
- **Email**: kaveesha@student.lk | **Password**: student123
- **Email**: thilini@student.lk | **Password**: student123

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "password123",
  "yearOfStudy": 2,
  "department": "Computer Science",
  "preferredLanguage": "english"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "<refresh_token>"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

### Video Endpoints

#### Get All Videos
```http
GET /videos?category=DSA&language=english&page=1&limit=10
```

#### Get Video by ID
```http
GET /videos/:id
```

#### Get Recommendations (Private)
```http
GET /videos/recommendations?limit=6
Authorization: Bearer <access_token>
```

#### Create Video (Admin)
```http
POST /videos
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Video Title",
  "description": "Description",
  "category": "DSA",
  "language": "english",
  "videoUrl": "https://youtube.com/...",
  "difficulty": "beginner",
  "topics": ["Arrays", "Sorting"]
}
```

#### Update Video (Admin)
```http
PUT /videos/:id
Authorization: Bearer <access_token>
Content-Type: application/json
```

#### Delete Video (Admin)
```http
DELETE /videos/:id
Authorization: Bearer <access_token>
```

### Coding Module Endpoints

#### Get All Modules
```http
GET /coding-modules?category=DSA&type=coding&language=english
```

#### Get Module by ID
```http
GET /coding-modules/:id
```

#### Create Module (Admin)
```http
POST /coding-modules
Authorization: Bearer <access_token>
```

#### Update Module (Admin)
```http
PUT /coding-modules/:id
Authorization: Bearer <access_token>
```

#### Delete Module (Admin)
```http
DELETE /coding-modules/:id
Authorization: Bearer <access_token>
```

#### Mark Module Complete
```http
POST /coding-modules/:id/complete
Authorization: Bearer <access_token>
```

### Resource Link Endpoints

#### Get All Links
```http
GET /resource-links?category=DSA&type=youtube
```

#### Get Link by ID
```http
GET /resource-links/:id
```

#### Create Link (Admin)
```http
POST /resource-links
Authorization: Bearer <access_token>
```

#### Update Link (Admin)
```http
PUT /resource-links/:id
Authorization: Bearer <access_token>
```

#### Delete Link (Admin)
```http
DELETE /resource-links/:id
Authorization: Bearer <access_token>
```

### Student Management Endpoints (Admin Only)

#### Get All Students
```http
GET /students?department=CS&yearOfStudy=2
Authorization: Bearer <access_token>
```

#### Get Dashboard Stats
```http
GET /students/dashboard
Authorization: Bearer <access_token>
```

#### Get Student by ID
```http
GET /students/:id
Authorization: Bearer <access_token>
```

#### Update Student
```http
PUT /students/:id
Authorization: Bearer <access_token>
```

#### Delete Student
```http
DELETE /students/:id
Authorization: Bearer <access_token>
```

## 🎨 Features in Detail

### Multilingual Support
- **Tamil**: தமிழ்
- **Sinhala**: සිංහල
- **English**: English

All content (videos, coding modules, resource links) can be tagged with a language, and students can set their preferred language for personalized recommendations.

### Video Learning Section
- Browse videos by category, language, and difficulty
- Watch videos with YouTube embed
- Download supplementary materials
- Access external resource links
- View count tracking

### Coding Playground
- Monaco Editor with syntax highlighting
- Support for JavaScript, Python, Java, C++
- Sample test cases
- Real-time code execution (JavaScript only in browser)
- Multiple coding challenges

### Graphics Simulation
- Canvas-based visualization
- 2D transformations: Translation, Rotation, Scaling
- Real-time parameter adjustment
- Visual comparison (original vs transformed)

### Admin Panel
- Comprehensive dashboard with statistics
- Student management (view, delete)
- Video CRUD operations
- Coding module management
- Resource link management
- Responsive sidebar navigation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 day expiry)
- Protected routes with authentication middleware
- Role-based access control (Student/Admin)
- CORS configuration
- Token refresh mechanism

## 🚀 Deployment

### Backend Deployment (Example: Heroku)

1. Create a Heroku app
2. Add MongoDB Atlas connection string
3. Set environment variables
4. Deploy:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Example: Vercel)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## 🤝 Contributing

This is a student project. Feel free to fork and enhance!

## 📝 Future Enhancements

- [ ] Real-time chat support
- [ ] Progress tracking and analytics
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Video upload functionality
- [ ] Quiz and assessment system
- [ ] Discussion forums
- [ ] Notification system
- [ ] Advanced search with filters
- [ ] Social features (share, like, comment)

## 📄 License

This project is created for educational purposes.

## 👥 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for Sri Lankan Students**
