# NG AlgoVista - Problem-Solving Platform with DSA Visualizations

**Visualize • Solve • Master Algorithms**

A comprehensive algorithm learning platform built with React, Node.js, and MongoDB. NG AlgoVista combines interactive problem-solving with algorithm visualization to help developers build deep understanding and coding confidence.

## 🌟 Platform Philosophy

NG AlgoVista is not just another coding platform—it's a learning-first environment designed to help you:
- **Visualize** algorithms through interactive demonstrations
- **Solve** real coding problems with AI-powered assistance
- **Master** data structures and algorithms through practice

## ✨ Key Features

### 🎯 Core Learning Experience
- **Clean Problem Interface**: Professional, distraction-free coding environment
- **Multi-language Support**: JavaScript, C++, and Java with Monaco Editor
- **Real-time Code Execution**: Instant feedback with test case validation
- **LeetCode-Style Wrapper System**: Function-based problem solving with automatic test case injection
- **Algorithm Visualization**: Interactive DSA visualizations (linked via external platform)
- **Smart Code Persistence**: Your code automatically saves per language/problem

### 🤖 AI-Powered Learning
- **Groq AI Chat Assistant**: Fast, free AI help powered by llama-3.3-70b-versatile
- **Context-Aware Guidance**: Problem-specific hints and explanations
- **Code Analysis**: Get optimization suggestions and debugging help
- **Learning Path**: Personalized recommendations based on your progress

### 📊 Progress Tracking
- **User Profile**: Track solved problems, acceptance rate, and streak
- **Submission History**: Detailed analytics for every submission
- **Difficulty Breakdown**: Easy/Medium/Hard problem statistics
- **Performance Metrics**: Runtime and memory usage tracking

### 🎨 Modern Design
- **Clean, Calm UI**: Slate-based dark theme with emerald accents
- **Professional Layout**: Production-ready, interview-worthy interface
- **Glassmorphism Effects**: Subtle, elegant design elements
- **Responsive**: Works beautifully on desktop and mobile

### 🛡️ Admin Management
- **Problem Creation**: Complete admin panel with functionMetadata support
- **Video Tutorials**: Upload solution videos with secure cloud storage
- **Content Management**: Update, delete, and organize problems
- **User Administration**: Role-based access control

## 🛠️ Technology Stack

### Frontend
- **React 19** - Latest React with modern hooks and features
- **Vite** - Lightning-fast build tool and dev server
- **Monaco Editor** - Professional code editor (VS Code engine)
- **Redux Toolkit** - Centralized state management
- **React Router v7** - Client-side routing
- **React Hook Form** - Form handling with Zod validation
- **Tailwind CSS** - Utility-first styling framework
- **DaisyUI** - Tailwind component library
- **Lucide React** - Beautiful, customizable icons
- **Axios** - Promise-based HTTP client

### Backend
- **Node.js + Express.js** - RESTful API server
- **MongoDB + Mongoose** - NoSQL database with ODM
- **Redis** - Caching layer (optional)
- **JWT** - Secure token-based authentication
- **bcrypt** - Password hashing and security
- **Groq SDK** - AI chat integration (llama-3.3-70b-versatile)
- **Judge0** - Code execution engine
- **CORS + Cookie Parser** - Cross-origin security

### Infrastructure & Tools
- **Judge0 API** - Sandboxed code execution with 60+ languages
- **Groq Cloud** - Free, fast AI inference
- **Cloudinary** - Video storage for editorial solutions
- **ESLint** - Code quality and consistency
- **Zod** - Runtime type validation

## 📁 Project Structure

```
NG-ALGAVISTA/
├── backend/                 # Node.js + Express API
│   ├── index.js            # Main server entry point
│   ├── package.json        # Backend dependencies
│   ├── .env.example        # Environment variables template
│   └── src/
│       ├── config/         # Database (MongoDB) and Redis config
│       ├── controllers/    # Route handlers and business logic
│       │   ├── userProblem.js       # Problem CRUD operations
│       │   ├── usersubmission.js    # Code execution & submission
│       │   ├── solveDoubt.js        # Groq AI chat integration
│       │   └── videoSection.js      # Editorial video management
│       ├── middleware/     # Authentication & authorization
│       │   ├── usermiddleware.js    # JWT verification
│       │   └── adminmiddleware.js   # Admin role check
│       ├── models/         # Mongoose schemas
│       │   ├── user.js              # User model (auth, solved problems)
│       │   ├── problem.js           # Problem with functionMetadata
│       │   ├── submission.js        # Submission tracking
│       │   └── solutionVideo.js     # Editorial videos
│       ├── routers/        # API route definitions
│       │   ├── userauth.js          # Authentication routes
│       │   ├── problemcreator.js    # Problem management
│       │   ├── submit.js            # Code submission
│       │   ├── aiChatting.js        # AI chat routes
│       │   └── videoCreator.js      # Video upload routes
│       └── utils/          # Helper functions
│           ├── problemUtility.js    # Judge0 integration
│           ├── codeMerger.js        # LeetCode-style wrapper logic
│           └── validator.js         # Input validation
│
└── frontend/               # React + Vite SPA
    ├── index.html          # HTML entry point
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    ├── tailwind.config.js  # Tailwind CSS config
    └── src/
        ├── App.jsx         # Main app with routing
        ├── main.jsx        # React entry point
        ├── authSlice.js    # Redux authentication slice
        ├── components/     # Reusable React components
        │   ├── AdminPanel.jsx       # Create problems with metadata
        │   ├── AdminUpdate.jsx      # Update existing problems
        │   ├── AdminDelete.jsx      # Delete problems
        │   ├── AdminVideo.jsx       # Video management
        │   ├── ChatAI.jsx           # AI chat interface
        │   ├── Editorial.jsx        # Video solution player
        │   └── SubmissionHistory.jsx # Submission table
        ├── pages/          # Page components
        │   ├── LandingPage.jsx      # Public homepage
        │   ├── Login.jsx            # Sign in page
        │   ├── Signup.jsx           # Sign up page
        │   ├── Homepage.jsx         # Problem list (logged in)
        │   ├── ProblemPage.jsx      # Code editor + problem view
        │   ├── Profile.jsx          # User stats and progress
        │   ├── Admin.jsx            # Admin dashboard
        │   ├── About.jsx            # About NG AlgoVista
        │   └── Contact.jsx          # Contact page
        ├── store/          # Redux store
        │   └── store.js
        └── utils/          # Frontend utilities
            └── axiosClient.js       # Configured Axios instance
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **Redis** (optional, for caching)
- **Groq API Key** (free at console.groq.com)
- **Judge0 API Access** (free tier available)
- **Cloudinary Account** (for video uploads, optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "MAJOR PROJECT LEETCODE"
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
   MONGODB_URI=mongodb://localhost:27017/ng-algovista
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=your-super-secret-jwt-key-change-this
   
   # Groq AI (Get free key from console.groq.com/keys)
   GROQ_API_KEY=your-groq-api-key
   
   # Judge0 API (Get from rapidapi.com or self-host)
   JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your-rapidapi-key
   
   # Cloudinary (Optional, for video uploads)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
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
```javascript
{
  firstname: String,
  lastname: String,
  emailid: String (unique),
  password: String (hashed),
  role: String (enum: ['user', 'admin']),
  solvedProblems: [ObjectId] (ref: Problem),
  createdAt: Date
}
```

### Problem Model
```javascript
{
  title: String,
  description: String,
  difficulty: String (enum: ['easy', 'medium', 'hard']),
  tags: String (enum: ['array', 'linkedList', 'graph', 'dp']),
  visibleTestCases: [{
    input: String,
    output: String,
    explanation: String
  }],
  hiddenTestCases: [{
    input: String,
    expectedOutput: String
  }],
  startCode: [{
    language: String,
    initialCode: String
  }],
  functionMetadata: {           // LeetCode-style wrapper metadata
    functionName: String,
    languages: {
      java: { signature: String, returnType: String },
      cpp: { signature: String, returnType: String },
      javascript: { signature: String, returnType: String }
    }
  },
  referenceSolution: [{
    language: String,
    completeCode: String
  }],
  createdBy: ObjectId (ref: User)
}
```

### Submission Model
```javascript
{
  userId: ObjectId (ref: User),
  problemId: ObjectId (ref: Problem),
  code: String,
  language: String (enum: ['javascript', 'c++', 'java']),
  status: String (enum: ['pending', 'accepted', 'wrong', 'error']),
  runtime: Number,
  memory: Number,
  testCasesPassed: Number,
  testCasesTotal: Number,
  createdAt: Date
}
```

### SolutionVideo Model
```javascript
{
  problemId: ObjectId (ref: Problem),
  secureUrl: String,
  thumbnailUrl: String,
  duration: Number,
  createdAt: Date
}
```

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

### Groq Cloud AI
- **Model**: llama-3.3-70b-versatile (free, fast inference)
- **Purpose**: Context-aware coding assistance
- **Features**:
  - Problem-specific guidance and hints
  - Code explanation and debugging
  - Algorithm suggestions
  - Optimization recommendations
  - Learning path guidance

### Why Groq instead of Google Gemini?
- **Free tier**: Generous free usage limits
- **Speed**: Faster inference than Gemini
- **Reliability**: No model availability issues
- **Quality**: Excellent code understanding with llama-3.3-70b

### AI Chat Features
- Real-time responses with streaming support
- Persistent chat history per problem
- Code snippet analysis
- Natural language algorithm explanations

## 💻 Code Editor Features

### Monaco Editor Integration
- **Same engine as VS Code**: Professional coding experience
- **Syntax highlighting**: All supported languages
- **IntelliSense**: Auto-completion and suggestions
- **Error detection**: Real-time linting
- **Code formatting**: Automatic formatting on save
- **Multi-language**: Seamless switching between JavaScript, C++, Java

### LeetCode-Style Wrapper System
NG AlgoVista uses an intelligent wrapper system to convert user functions into executable code:

**User writes:**
```javascript
function twoSum(nums, target) {
  // your solution
}
```

**System wraps with:**
```javascript
const input = JSON.parse(process.argv[2]);
const nums = input.nums;
const target = input.target;

function twoSum(nums, target) {
  // your solution
}

const result = twoSum(nums, target);
console.log(JSON.stringify(result));
```

This allows:
- Clean function-based problem solving
- Automatic test case injection
- Seamless multi-language support
- Professional LeetCode-like experience

### Code Persistence
- **Auto-save**: Code saves automatically to localStorage
- **Per-language storage**: Different code for each language
- **Per-problem storage**: Code persists across sessions
- **Tab state**: Remember which tab you were on

## 📈 Submission System

### Judge0 Integration
- **Sandboxed execution**: Secure code execution environment
- **60+ languages**: Full language support
- **Real-time compilation**: Fast code execution
- **Memory limits**: Prevent resource abuse
- **Time limits**: Execution timeout protection

### Code Execution Flow
1. User writes solution function
2. System wraps code with test case logic
3. Code sent to Judge0 API
4. Judge0 compiles and runs in sandbox
5. Results returned with metrics
6. System validates output against expected results

### Submission Analytics
- **Detailed history**: All submissions with timestamps
- **Performance metrics**: Runtime and memory tracking
- **Success rate**: Acceptance percentage
- **Test case breakdown**: See which cases passed/failed
- **Code optimization**: Compare with reference solutions

## 🎨 User Interface Design

### Design Philosophy
NG AlgoVista follows a **clean, calm, and professional** design approach:

**Color Scheme:**
- Dark neutral theme (slate-800/900)
- Emerald/teal accents for success states
- Minimal use of bright colors
- No neon greens or excessive purples

**Typography:**
- Clear hierarchy with proper heading sizes
- Generous white space for readability
- Subtle borders instead of heavy gradients
- Professional, interview-worthy aesthetic

**UI Components:**
- **Problem Interface**: Clean card-based layout with minimal distractions
- **Code Editor**: Professional dark theme matching VS Code
- **Results Display**: Simple status cards (✔ Accepted / ✖ Wrong Answer)
- **Test Cases**: Collapsible accordions, not large blocks
- **Metrics**: Small, subtle cards for runtime/memory

### Page Designs

**Landing Page:**
- Gradient hero with "Visualize Algorithms. Solve with Confidence."
- Feature cards showcasing platform capabilities
- About and Contact pages with professional layouts

**Authentication:**
- Glassmorphism sign-in/sign-up cards
- Purple-to-pink gradient backgrounds
- Eye icons for password visibility toggle

**Problem Solving:**
- Split-panel layout (description | code editor)
- Tab-based navigation (Description, Editorial, Submissions, AI Chat)
- Clean Monaco editor with language selector
- Minimal action buttons (Run Code, Submit)

**Profile Page:**
- User stats dashboard with metrics
- Problem difficulty breakdown
- Acceptance rate visualization

## 🔧 API Endpoints

### Authentication Routes (`/user`)
```
POST   /user/signup          - Create new user account
POST   /user/login           - Authenticate user
POST   /user/logout          - Clear authentication cookie
GET    /user/checkAuth       - Verify JWT token
```

### Problem Routes (`/problem`)
```
GET    /problem/getAllProblem              - List all problems
GET    /problem/problemById/:id            - Get specific problem details
GET    /problem/problemSolvedByUser        - Get user's solved problems
POST   /problem/createProblem              - Create problem (admin)
PUT    /problem/updateProblem/:id          - Update problem (admin)
DELETE /problem/deleteProblem/:id          - Delete problem (admin)
```

### Submission Routes (`/submission`)
```
POST   /submission/run/:id                 - Run code against visible test cases
POST   /submission/submit/:id              - Submit solution for evaluation
GET    /submission/userSubmission          - Get user's submission history
```

### AI Chat Routes (`/ai`)
```
POST   /ai/chat                            - Send message to Groq AI
  Body: { problemId, message, chatHistory }
```

### Video Routes (`/video`)
```
POST   /video/upload/:problemId            - Upload editorial video (admin)
GET    /video/:problemId                   - Get video for problem
DELETE /video/delete/:problemId            - Delete video (admin)
```

## 🚀 Deployment

### Backend Deployment (Railway / Render / Heroku)
1. Set up MongoDB Atlas cloud database
2. Optional: Configure Redis Cloud instance
3. Set all environment variables in platform dashboard
4. Connect GitHub repository
5. Deploy from main branch

**Required Environment Variables:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
GROQ_API_KEY=...
JUDGE0_API_URL=...
JUDGE0_API_KEY=...
```

### Frontend Deployment (Vercel / Netlify)
1. Build production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Connect GitHub repository to Vercel/Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
5. Deploy automatically on push

### Domain Configuration
- Update CORS settings in backend to allow frontend domain
- Configure custom domain in deployment platform
- Update `axiosClient.js` with production API URL

## 🏗️ Architecture Highlights

### LeetCode-Style Wrapper System
The platform automatically converts user-written functions into executable Judge0 code:
- **Legacy Mode**: Direct stdin/stdout problems (older format)
- **Function Mode**: Modern function-based problems with automatic wrapping
- Auto-detection based on `functionMetadata` presence in problem schema

### Code Execution Pipeline
```
User Code → Validation → Wrapper Generation → Judge0 API → 
Result Processing → Database Update → Response to User
```

### Authentication Flow
```
User Login → JWT Generation → Cookie Storage → 
Middleware Verification → Protected Route Access
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly
4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines
- Use meaningful variable and function names
- Follow Tailwind CSS utility-first approach
- Validate all user inputs with Zod
- Handle errors gracefully with try-catch
- Write clean, readable code

## 📝 License

This project is licensed under the **ISC License**.

## 🙏 Acknowledgments

- **Inspiration**: LeetCode, AlgoExpert, NeetCode
- **Monaco Editor**: Microsoft's amazing code editor
- **Groq**: Free, fast AI inference platform
- **Judge0**: Robust code execution engine
- **Open Source Community**: All the wonderful libraries and tools

## 👨‍💻 Creator

**Namra Gajera**  
*Full Stack Developer & Algorithm Enthusiast*

> "Building tools that make learning algorithms less intimidating and more rewarding."

## 📞 Support & Contact

- **Issues**: Open an issue on GitHub
- **Feature Requests**: Submit via GitHub Issues
- **Contact**: Available via the platform's contact page
- **Documentation**: This README and inline code comments

## 🎯 Roadmap

**Planned Features:**
- [ ] More algorithm visualizations
- [ ] Real-time multiplayer coding challenges
- [ ] Leaderboard and streak tracking
- [ ] Video tutorial integration
- [ ] Mobile app (React Native)
- [ ] More programming languages (Python, Go, Rust)
- [ ] Company-specific problem sets
- [ ] Mock interview mode

---

## 🌟 Star the Project!

If you find NG AlgoVista helpful, please consider giving it a ⭐ on GitHub!

**Happy Coding! 🚀 Master Algorithms with Confidence.** 
