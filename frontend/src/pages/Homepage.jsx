import { useEffect, useState } from 'react';
import { NavLink } from 'react-router'; // Fixed import
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all' 
  });

  // // Debug user data
  // console.log('User data:', user);
  // console.log('User role:', user?.role);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblem');
        console.log(data);
        setProblems(data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get('/problem/problemSolvedByUser');
        setSolvedProblems(data);
      } catch (error) {
        console.error('Error fetching solved problems:', error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]); // Clear solved problems on logout
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      solvedProblems.some(sp => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Bar */}
      <nav className="navbar bg-white/10 backdrop-blur-md shadow-2xl border-b border-white/20 px-4">
        <div className="flex-1">
          <NavLink to="/" className="btn btn-ghost text-xl text-white hover:text-yellow-300 transition-colors duration-300">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">
              LeetCode
            </span>
          </NavLink>
        </div>
        <div className="flex-none gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} className="btn btn-ghost flex items-center gap-3 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm rounded-xl p-2 hover:shadow-lg hover:shadow-purple-500/25 group">
              <div className="avatar placeholder relative">
                <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{user?.firstname?.[0]?.toUpperCase() || "U"}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
              </div>
              <div className="flex flex-col items-start">
                <span className="font-bold text-base leading-tight text-white group-hover:text-yellow-300 transition-colors duration-300">
                  {user?.firstname} {user?.lastname}
                </span>
                <span className="text-xs text-white/70 capitalize bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">
                  {user?.role}
                </span>
              </div>
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <ul className="mt-3 p-2 shadow-xl menu menu-sm dropdown-content bg-white/10 backdrop-blur-md rounded-box w-52 border border-white/20">
              <li><button onClick={handleLogout} className="text-white hover:bg-white/20">Logout</button></li>
              {user && user.role === 'admin' && (
                <li><NavLink to="/admin" className="text-white hover:bg-white/20">Admin Panel</NavLink></li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
            Master Your Coding Skills
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Solve challenging problems, track your progress, and become a coding expert with our curated collection of algorithmic challenges.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {/* New Status Filter */}
          <select 
            className="select select-bordered bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="all" className="text-black">All Problems</option>
            <option value="solved" className="text-black">Solved Problems</option>
          </select>

          <select 
            className="select select-bordered bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300"
            value={filters.difficulty}
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
          >
            <option value="all" className="text-black">All Difficulties</option>
            <option value="easy" className="text-black">Easy</option>
            <option value="medium" className="text-black">Medium</option>
            <option value="hard" className="text-black">Hard</option>
          </select>

          <select 
            className="select select-bordered bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 transition-all duration-300"
            value={filters.tag}
            onChange={(e) => setFilters({...filters, tag: e.target.value})}
          >
            <option value="all" className="text-black">All Tags</option>
            <option value="array" className="text-black">Array</option>
            <option value="linkedList" className="text-black">Linked List</option>
            <option value="graph" className="text-black">Graph</option>
            <option value="dp" className="text-black">DP</option>
          </select>
        </div>

        {/* Problems List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProblems.map(problem => (
            <div key={problem._id} className="card bg-white/10 backdrop-blur-md shadow-2xl border border-white/20 hover:scale-105 transition-all duration-300 group">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-white group-hover:text-yellow-300 transition-colors duration-300">
                    <NavLink to={`/problem/${problem._id}`} className="hover:text-yellow-300 transition-colors duration-300">
                      {problem.title}
                    </NavLink>
                  </h2>
                  {solvedProblems.some(sp => sp._id === problem._id) && (
                    <div className="badge badge-success gap-2 bg-green-500/20 text-green-300 border-green-500/30">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Solved
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <div className={`badge ${getDifficultyBadgeColor(problem.difficulty)} bg-opacity-20 border border-current/30`}>
                    {problem.difficulty}
                  </div>
                  <div className="badge badge-info bg-blue-500/20 text-blue-300 border-blue-500/30">
                    {problem.tags}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProblems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Problems Found</h3>
            <p className="text-white/70">Try adjusting your filters to see more problems.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'badge-success bg-green-500/20 text-green-300 border-green-500/30';
    case 'medium': return 'badge-warning bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'hard': return 'badge-error bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'badge-neutral bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

export default Homepage;