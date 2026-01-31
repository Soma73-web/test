# NEET Academy - Student Management System

A comprehensive web application for managing NEET academy operations, including student management, attendance tracking, test results, and more.

## 🚀 Features

### For Students

- **Student Login Portal**: Secure authentication system
- **Attendance Calendar**: Visual monthly attendance tracking with hover tooltips for absence reasons
- **Test Results Dashboard**: View test scores with filtering by test number
- **Performance Analytics**: Track progress with charts and statistics

### For Admins

- **Student Management**: Create, edit, and manage student accounts
- **Attendance Management**: Mark daily attendance with reasons
- **Test Results Management**: Add and update test scores with automatic grade calculation
- **Events Management**: Manage institute events and announcements
- **Gallery Management**: Upload and organize photos
- **Content Management**: Manage sliders, testimonials, downloads

### Public Features

- **Institute Showcase**: Dynamic slider with latest updates
- **Events Gallery**: Display upcoming and past events
- **Results Gallery**: Showcase top performers
- **Course Information**: Detailed course offerings
- **Testimonials**: Student success stories with video integration

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Slick** - Carousel component
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

5. Set up database:

```bash
# Create database and run the SQL setup file
mysql -u your_username -p < database_setup.sql
```

6. Start the server:

```bash
npm start
```

### Frontend Setup

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

5. Start the development server:

```bash
npm start
```

## 🗄️ Database Schema

The application uses the following main tables:

- `students` - Student information and credentials
- `attendance` - Daily attendance records
- `test_results` - Test scores and grades
- `events` - Institute events and announcements
- `testimonials` - Student testimonials
- `gallery` - Photo gallery
- `results` - Showcase results
- `downloads` - Downloadable resources

## 🔐 Authentication

### Student Authentication

- Students log in using their Student ID and password
- JWT tokens are used for session management
- Passwords are hashed using bcrypt

### Admin Authentication

- Simple admin authentication system
- Can be enhanced with role-based access control

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Loading States**: Beautiful loading animations and messages
- **Error Boundaries**: Graceful error handling
- **Empty States**: Informative messages when no data is available
- **Accessibility**: WCAG compliant components
- **Dark Mode Ready**: CSS variables for easy theming

## 📱 Progressive Web App Features

- **Fast Loading**: Optimized bundle sizes
- **Offline Capability**: Service worker ready
- **Mobile Optimized**: Touch-friendly interface
- **Performance**: Lazy loading and code splitting

## 🚀 Deployment

### Production Build

1. Build frontend:

```bash
cd client
npm run build
```

2. Configure production environment variables

3. Deploy backend to your server (PM2 recommended):

```bash
npm install -g pm2
pm2 start server.js --name "neet-academy-api"
```

4. Serve frontend build files with nginx or apache

### Environment Variables for Production

**Backend (.env):**

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env.production):**

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com
GENERATE_SOURCEMAP=false
```

## 🔧 Configuration

### API Endpoints

#### Student Routes

- `POST /api/students/login` - Student login
- `GET /api/students/:id/attendance` - Get attendance
- `GET /api/students/:id/test-results` - Get test results

#### Admin Routes

- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `POST /api/admin/attendance` - Mark attendance
- `POST /api/admin/test-results` - Add test result

#### Public Routes

- `GET /api/events` - Get events
- `GET /api/gallery` - Get gallery images
- `GET /api/testimonials` - Get testimonials

## 🧪 Testing

Run tests with:

```bash
# Frontend tests
cd client
npm test

# Backend tests (to be implemented)
cd backend
npm test
```

## 📊 Features in Detail

### Attendance Calendar

- Monthly view with color-coded attendance
- Green: Present, Red: Absent, Yellow: Late
- Hover tooltips show absence reasons
- Statistics showing attendance percentage

### Test Results

- Filter by test number
- Automatic grade calculation (A+ to F)
- Performance analytics
- Export functionality (future enhancement)

### Admin Dashboard

- Comprehensive student management
- Bulk operations support
- Real-time statistics
- Export capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Fee management system
- [ ] Parent portal
- [ ] Mobile app
- [ ] Advanced analytics
- [ ] SMS/Email notifications
- [ ] Online classes integration
- [ ] Assignment submission system
- [ ] Discussion forums

---

**Made with ❤️ for NEET Academy**
