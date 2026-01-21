# LeetCode Clone - Full Stack Coding Platform

A comprehensive LeetCode-style coding platform built with React, Node.js, and MongoDB. This project provides a complete environment for practicing coding problems with features like code execution, AI assistance, submission history, and admin management.

## 🚀 Features

### Core Features
- **Problem Solving Interface**: Interactive code editor with syntax highlighting
- **Multi-language Support**: JavaScript, C++, and Java
- **Code Execution**: Run and test your code against test cases
- **Submission System**: Submit solutions and get detailed feedback
- **Problem Management**: Create, update, and delete coding problems
- **User Authentication**: Secure login/signup system with JWT tokens
- **Role-based Access**: User and admin roles with different permissions

### Advanced Features
- **AI Coding Assistant**: Integrated AI chat for problem-solving help
- **Submission History**: Track all your previous submissions with detailed analytics
- **Real-time Code Persistence**: Code is automatically saved to localStorage
- **Test Case Management**: Visible and hidden test cases for comprehensive testing
- **Performance Metrics**: Runtime and memory usage tracking
- **Problem Categories**: Organized by difficulty (Easy, Medium, Hard) and tags

### Admin Features
- **Problem Creation**: Admin panel for creating new coding problems
- **Problem Management**: Update and delete existing problems
- **User Management**: View and manage user accounts
- **Content Moderation**: Full control over platform content

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Monaco Editor** - Professional code editor (same as VS Code)
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind CSS
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis** - In-memory data structure store
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Google Generative AI** - AI-powered coding assistance
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### Development Tools
- **ESLint** - Code linting
- **Zod** - Schema validation
- **Dotenv** - Environment variable management

## 📁 Project Structure

```
MAJOR PROJECT LEETCODE/
├── backend/                 # Backend server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── src/
│       ├── config/         # Database and Redis configuration
│       ├── controllers/    # Business logic handlers
│       ├── middleware/     # Authentication and validation middleware
│       ├── models/         # MongoDB schemas
│       ├── routers/        # API route definitions
│       └── utils/          # Utility functions
└── frontend/               # React frontend
    ├── index.html          # HTML entry point
    ├── package.json        # Frontend dependencies
    └── src/
        ├── components/     # Reusable React components
        ├── pages/          # Page components
        ├── store/          # Redux store configuration
        ├── utils/          # Utility functions
        └── App.jsx         # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Redis
- Google Generative AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MAJOR PROJECT LEETCODE
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create `.env` file in the backend directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/leetcode-clone
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-jwt-secret-key
   GOOGLE_AI_API_KEY=your-google-ai-api-key
   ```

5. **Start the Development Servers**
   
   Backend:
   ```bash
   cd backend
   npm start
   ```
   
   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📊 Database Schema

### User Model
- Basic user information (name, email, age)
- Role-based access (user/admin)
- Password hashing with bcrypt
- Track of solved problems

### Problem Model
- Problem details (title, description, difficulty)
- Test cases (visible and hidden)
- Reference solutions in multiple languages
- Starter code templates
- Problem creator reference

### Submission Model
- User and problem references
- Code submission with language
- Execution status and results
- Performance metrics (runtime, memory)
- Test case results

## 🔐 Authentication & Authorization

### User Authentication
- JWT-based authentication
- Secure password hashing with bcrypt
- Cookie-based token storage
- Automatic token refresh

### Role-based Access Control
- **User Role**: Can solve problems, view submissions, use AI chat
- **Admin Role**: Full access to problem management and user administration

## 🤖 AI Integration

### Google Generative AI
- Context-aware coding assistance
- Problem-specific guidance
- Code explanation and debugging help
- Algorithm suggestions and optimization tips

### AI Chat Features
- Persistent chat history per problem
- Real-time responses
- Code analysis and suggestions
- Learning path recommendations

## 💻 Code Editor Features

### Monaco Editor Integration
- Syntax highlighting for multiple languages
- Auto-completion and IntelliSense
- Error detection and linting
- Code formatting
- Multiple language support (JavaScript, C++, Java)

### Code Persistence
- Automatic code saving to localStorage
- Language-specific code storage
- Tab state persistence
- Session restoration

## 📈 Submission System

### Code Execution
- Real-time code compilation and execution
- Test case validation
- Performance benchmarking
- Error handling and debugging

### Submission Analytics
- Detailed submission history
- Performance metrics tracking
- Success rate analysis
- Code optimization suggestions

## 🎨 User Interface

### Modern Design
- Responsive design with Tailwind CSS
- DaisyUI components for consistent styling
- Dark/light theme support
- Mobile-friendly interface

### User Experience
- Intuitive navigation
- Real-time feedback
- Progress tracking
- Interactive problem solving

## 🔧 API Endpoints

### Authentication
- `POST /user/signup` - User registration
- `POST /user/login` - User login
- `POST /user/logout` - User logout
- `GET /user/profile` - Get user profile

### Problems
- `GET /problem/all` - Get all problems
- `GET /problem/problemById/:id` - Get specific problem
- `POST /problem/create` - Create new problem (admin)
- `PUT /problem/update/:id` - Update problem (admin)
- `DELETE /problem/delete/:id` - Delete problem (admin)

### Submissions
- `POST /submission/submit` - Submit code solution
- `GET /problem/submittedProblem/:id` - Get submission history

### AI Chat
- `POST /ai/chat` - AI coding assistance

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure Redis instance
3. Set environment variables
4. Deploy to platforms like Heroku, Railway, or AWS

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- LeetCode for inspiration
- Monaco Editor for the excellent code editing experience
- Google Generative AI for AI assistance capabilities
- The open-source community for various libraries and tools

## 📞 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Happy Coding! 🎉** 