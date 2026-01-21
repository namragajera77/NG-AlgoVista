import { Link } from 'react-router';

const LandingPage = () => (
  <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
    {/* Navigation Bar - matches Login/Signup */}
    <nav className="flex justify-between items-center px-8 py-6 bg-white/10 backdrop-blur-md shadow-xl border-b border-white/20">
      <h1 className="text-5xl font-bold text-yellow-300 drop-shadow-md tracking-wide flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="h-10" />
        LeetCode
      </h1>
      <div className="flex gap-4">
        <Link to="/signup" className="btn btn-primary rounded-full px-6">Sign Up</Link>
        <Link to="/login" className="btn btn-outline rounded-full px-6">Sign In</Link>
      </div>
    </nav>

    {/* Hero Section - Visualizer & Problem Solving Focus */}
    <section className="flex flex-col items-center justify-center py-24">
      <h1 className="text-5xl font-extrabold mb-6 text-center">Algorithm Visualizer & Problem Solving</h1>
      <p className="text-lg mb-8 max-w-2xl text-center">
        Visualize algorithms step-by-step and solve coding problems just like LeetCode.<br />
        Perfect for learning, practicing, and mastering data structures and algorithms interactively.
      </p>
      <Link to="/signup" className="btn btn-success btn-lg rounded-full px-8">Get Started Free</Link>
    </section>

    {/* Features Section - Highlight Visualizer & Problems */}
    <section className="flex flex-wrap justify-center gap-8 py-12">
      <div className="bg-white/10 rounded-xl p-8 w-72 shadow-lg flex flex-col items-center">
        <span className="text-4xl mb-2">🧮</span>
        <h2 className="text-xl font-bold mb-2">Algorithm Visualizer</h2>
        <p className="text-sm text-center">Watch sorting, searching, and graph algorithms in action. Step through each operation visually.</p>
      </div>
      <div className="bg-white/10 rounded-xl p-8 w-72 shadow-lg flex flex-col items-center">
        <span className="text-4xl mb-2">💡</span>
        <h2 className="text-xl font-bold mb-2">LeetCode-Style Problems</h2>
        <p className="text-sm text-center">Practice hundreds of coding problems with real-time feedback and test cases.</p>
      </div>
      <div className="bg-white/10 rounded-xl p-8 w-72 shadow-lg flex flex-col items-center">
        <span className="text-4xl mb-2">📊</span>
        <h2 className="text-xl font-bold mb-2">Track Your Progress</h2>
        <p className="text-sm text-center">See your stats, streaks, and improvement over time as you solve and visualize problems.</p>
      </div>
    </section>
  </div>
);

export default LandingPage;
