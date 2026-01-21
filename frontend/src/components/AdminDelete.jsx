import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { Trash2, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { useSelector } from 'react-redux';

const AdminDelete = () => {
  // State to store all the problems fetched from the server
  const [problems, setProblems] = useState([]);
  
  // State to show loading spinner while fetching problems
  const [loading, setLoading] = useState(true);
  
  // State to store any error messages that occur
  const [error, setError] = useState(null);
  
  // State to store the search term for filtering problems
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to store the difficulty filter (all, easy, medium, hard)
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  
  // State to track which problem is currently being deleted (to show loading on that specific button)
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Get user information from Redux store (to check if user is admin)
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // This effect runs when the component first loads
  useEffect(() => {
    fetchProblems(); // Fetch all problems from the server
  }, []);

  // Function to fetch all problems from the server
  const fetchProblems = async () => {
    try {
      // Show loading spinner
      setLoading(true);
      
      // Make API call to get all problems
      const { data } = await axiosClient.get('/problem/getAllProblem');
      
      // Store the problems in state
      setProblems(data);
    } catch (err) {
      // If there's an error, log it and show error message
      console.error('Fetch error details:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      setError(`Failed to fetch problems: ${err.response?.data || err.message}`);
    } finally {
      // Hide loading spinner whether success or error
      setLoading(false);
    }
  };

  // Function to delete a specific problem
  const handleDelete = async (id, title) => {
    // Show confirmation dialog before deleting
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;
    
    try {
      // Show loading spinner on the specific delete button
      setDeleteLoading(id);
      
      // Make API call to delete the problem
      await axiosClient.delete(`/problem/delete/${id}`);
      
      // Remove the deleted problem from the local state
      setProblems(problems.filter(problem => problem._id !== id));
      
      // Show success message to the user
      const toast = document.createElement('div');
      toast.className = 'alert alert-success fixed top-4 right-4 z-50 shadow-lg';
      toast.innerHTML = `
        <CheckCircle className="h-6 w-6" />
        <span>Problem "${title}" deleted successfully!</span>
      `;
      document.body.appendChild(toast);
      
      // Remove the success message after 3 seconds
      setTimeout(() => toast.remove(), 3000);
    } catch (err) {
      // If there's an error, show error message
      setError('Failed to delete problem');
      console.error(err);
    } finally {
      // Hide loading spinner whether success or error
      setDeleteLoading(null);
    }
  };

  // Function to test if user authentication is working (for debugging)
  const testAuth = async () => {
    try {
      const response = await axiosClient.get('/user/check');
      console.log('Auth test response:', response.data);
      alert('Authentication successful! User: ' + JSON.stringify(response.data.user));
    } catch (err) {
      console.error('Auth test failed:', err);
      alert('Authentication failed: ' + err.response?.data || err.message);
    }
  };

  // Function to test if API connection is working (for debugging)
  const testAPI = async () => {
    try {
      console.log('Testing API connection...');
      const response = await axiosClient.get('/problem/getAllProblem');
      console.log('API Response:', response.data);
      alert('API test successful! Found ' + response.data.length + ' problems');
    } catch (err) {
      console.error('API test failed:', err);
      alert('API test failed: ' + (err.response?.data || err.message));
    }
  };

  // Function to get the appropriate color class for difficulty badges
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'badge-success'; // Green for easy
      case 'medium': return 'badge-warning'; // Yellow for medium
      case 'hard': return 'badge-error'; // Red for hard
      default: return 'badge-info'; // Blue for unknown
    }
  };

  // Filter problems based on search term and difficulty filter
  const filteredProblems = problems.filter(problem => {
    // Check if problem title or tags match the search term
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if problem difficulty matches the selected filter
    const matchesDifficulty = filterDifficulty === 'all' || 
                             problem.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    
    // Return true only if both search and difficulty filters match
    return matchesSearch && matchesDifficulty;
  });

  // Show loading spinner while fetching problems
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-yellow-400"></span>
          <p className="mt-4 text-lg font-semibold text-white">Loading problems...</p>
        </div>
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="alert alert-error shadow-lg max-w-md bg-red-500/20 backdrop-blur-md border-red-500/30 text-red-300">
          <AlertTriangle className="h-6 w-6" />
          <div>
            <h3 className="font-bold">Error!</h3>
            <div className="text-sm">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 rounded-2xl mr-4 shadow-lg">
              <Trash2 className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Delete Problems</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Manage and remove coding problems from the platform. Please be careful as deleted problems cannot be recovered.
          </p>
          
          {/* Debug Info */}
          <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
            <h3 className="font-semibold mb-2 text-white">Debug Information:</h3>
            <div className="text-sm text-left text-white/80">
              <p><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</p>
              <p><strong>User Role:</strong> {user?.role || 'Not logged in'}</p>
              <p><strong>User ID:</strong> {user?._id || 'N/A'}</p>
            </div>
            <button 
              onClick={testAuth}
              className="btn btn-sm bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 mt-2"
            >
              Test Authentication
            </button>
            <button 
              onClick={testAPI}
              className="btn btn-sm bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 mt-2 ml-2"
            >
              Test API Connection
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
            <div className="stat-figure text-blue-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="stat-title text-white/70">Total Problems</div>
            <div className="stat-value text-blue-400">{problems.length}</div>
          </div>
          
          <div className="stat bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
            <div className="stat-figure text-green-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div className="stat-title text-white/70">Easy Problems</div>
            <div className="stat-value text-green-400">{problems.filter(p => p.difficulty?.toLowerCase() === 'easy').length}</div>
          </div>
          
          <div className="stat bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
            <div className="stat-figure text-yellow-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title text-white/70">Medium Problems</div>
            <div className="stat-value text-yellow-400">{problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="form-control flex-1">
              <div className="input-group">
                <span className="btn btn-square bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <Search className="h-4 w-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search problems..." 
                  className="input input-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-control">
              <div className="input-group">
                <span className="btn btn-square bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <Filter className="h-4 w-4" />
                </span>
                <select 
                  className="select select-bordered bg-white/10 backdrop-blur-md border-white/20 text-white focus:bg-white/20 transition-all duration-300"
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <option value="all" className="text-black">All Difficulties</option>
                  <option value="easy" className="text-black">Easy</option>
                  <option value="medium" className="text-black">Medium</option>
                  <option value="hard" className="text-black">Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-white/10 backdrop-blur-md">
                <tr>
                  <th className="w-16 text-white font-semibold">#</th>
                  <th className="w-1/3 text-white font-semibold">Title</th>
                  <th className="w-1/6 text-white font-semibold">Difficulty</th>
                  <th className="w-1/4 text-white font-semibold">Tags</th>
                  <th className="w-1/6 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <svg className="w-16 h-16 text-white/30 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-lg font-semibold text-white/70">No problems found</p>
                        <p className="text-white/50">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProblems.map((problem, index) => (
                    <tr key={problem._id} className="hover:bg-white/10 transition-colors border-b border-white/10">
                      <th className="font-mono text-white">{index + 1}</th>
                      <td>
                        <div className="font-semibold text-white">{problem.title}</div>
                        {problem.description && (
                          <div className="text-sm text-white/70 mt-1 line-clamp-2">
                            {problem.description}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${getDifficultyColor(problem.difficulty)} gap-2 bg-opacity-20 border border-current/30`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {problem.tags?.split(',').map((tag, tagIndex) => (
                            <span key={tagIndex} className="badge badge-outline badge-sm bg-white/10 text-white border-white/30">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <button 
                          onClick={() => handleDelete(problem._id, problem.title)}
                          disabled={deleteLoading === problem._id}
                          className={`btn btn-sm bg-gradient-to-r from-red-400 to-pink-500 border-0 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 gap-2 ${
                            deleteLoading === problem._id ? 'loading' : ''
                          }`}
                        >
                          {deleteLoading === problem._id ? (
                            'Deleting...'
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/50">
          <p>Showing {filteredProblems.length} of {problems.length} problems</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;