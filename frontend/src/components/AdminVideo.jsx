import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { Trash2, AlertTriangle, CheckCircle, Search, Filter, Video, VideoOff, Clock, Eye, RefreshCw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';

const AdminVideo = () => {
  // State to store all the problems with video information
  const [problems, setProblems] = useState([]);
  
  // State to show loading spinner while fetching problems
  const [loading, setLoading] = useState(true);
  
  // State to store any error messages that occur 
  const [error, setError] = useState(null);
  
  // State to store the search term for filtering problems
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to store the difficulty filter (all, easy, medium, hard)
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  
  // State to store the video status filter (all, hasVideo, noVideo)
  const [filterVideoStatus, setFilterVideoStatus] = useState('all');
  
  // State to track which problem's video is currently being deleted (to show loading on that specific button)
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // State to store success messages
  const [successMessage, setSuccessMessage] = useState(null);
  
  // State to track refresh loading
  const [refreshLoading, setRefreshLoading] = useState(false);
  
  // Get user information from Redux store (to check if user is admin)
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  // Debug user information
  console.log('User from Redux:', user);
  console.log('User role:', user?.role);
  console.log('Is authenticated:', isAuthenticated);

  // This effect runs when the component first loads
  useEffect(() => {
    fetchProblems(); // Fetch all problems with video information from the server
  }, []);

  // Function to fetch all problems with video information from the server
  const fetchProblems = async (isRefresh = false) => {
    try {
      // Show loading spinner
      if (isRefresh) {
        setRefreshLoading(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      console.log('Fetching problems with videos...');
      console.log('User:', user);
      console.log('Is authenticated:', isAuthenticated);
      
      // Check if user is admin
      if (!user || user.role !== 'admin') {
        console.error('User is not admin. User role:', user?.role);
        setError('Access denied: Admin privileges required');
        return;
      }
      
      // Make API call to get all problems with video information
      console.log('Making API call to /problem/getAllProblemWithVideos');
      let data;
      
      try {
        const response = await axiosClient.get('/problem/getAllProblemWithVideos');
        data = response.data;
        console.log('Received data from getAllProblemWithVideos:', data);
        console.log('Data length:', data?.length);
      } catch (apiError) {
        console.error('getAllProblemWithVideos failed, trying getAllProblem:', apiError);
        // Fallback to regular getAllProblem endpoint
        try {
          const fallbackResponse = await axiosClient.get('/problem/getAllProblem');
          data = fallbackResponse.data;
          console.log('Received data from getAllProblem fallback:', data);
          console.log('Data length:', data?.length);
        } catch (fallbackError) {
          console.error('getAllProblem also failed, trying testProblems:', fallbackError);
          // Try the test endpoint without any middleware
          const testResponse = await axiosClient.get('/problem/testProblems');
          data = testResponse.data;
          console.log('Received data from testProblems:', data);
          console.log('Data length:', data?.length);
        }
      }
      
      // Store the problems in state
      setProblems(data || []);
      
      // Show success message for refresh
      if (isRefresh) {
        setSuccessMessage('Data refreshed successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      // If there's an error, log it and show error message
      console.error('Fetch error details:', err);
      console.error('Response data:', err.response?.data);
      console.error('Response status:', err.response?.status);
      console.error('Error message:', err.message);
      const errorMessage = err.response?.data?.error || err.response?.data || err.message;
      setError(`Failed to fetch problems: ${errorMessage}`);
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      // Hide loading spinner whether success or error
      setLoading(false);
      setRefreshLoading(false);
    }
  };

  // Function to delete a specific video
  const handleDeleteVideo = async (problemId, problemTitle) => {
    // Show confirmation dialog before deleting
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the video for "${problemTitle}"?\n\n` +
      `This will:\n` +
      `• Remove the video from Cloudinary\n` +
      `• Delete the video record from the database\n` +
      `• This action cannot be undone\n\n` +
      `Click OK to proceed or Cancel to abort.`
    );
    
    if (!isConfirmed) {
      return;
    }
    
    try {
      // Show loading spinner on the specific delete button
      setDeleteLoading(problemId);
      setError(null);
      setSuccessMessage(null);
      
      // Make API call to delete the video
      const response = await axiosClient.delete(`/video/delete/${problemId}`);
      
      // Update the local state to reflect the video deletion
      setProblems(prevProblems => 
        prevProblems.map(problem => 
          problem._id === problemId 
            ? { ...problem, hasVideo: false, videoInfo: null }
            : problem
        )
      );
      
      // Show success message
      setSuccessMessage(`Video for "${problemTitle}" deleted successfully!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (err) {
      // If there's an error, show detailed error message
      console.error('Delete video error:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to delete video. Please try again.';
      setError(errorMessage);
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      // Hide loading spinner whether success or error
      setDeleteLoading(null);
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

  // Function to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter problems based on search term, difficulty filter, and video status filter
  const filteredProblems = problems.filter(problem => {
    // Check if problem title or tags match the search term
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.tags.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check if problem difficulty matches the selected filter
    const matchesDifficulty = filterDifficulty === 'all' || 
                             problem.difficulty?.toLowerCase() === filterDifficulty.toLowerCase();
    
    // Check if video status matches the selected filter
    const matchesVideoStatus = filterVideoStatus === 'all' || 
                              (filterVideoStatus === 'hasVideo' && problem.hasVideo) ||
                              (filterVideoStatus === 'noVideo' && !problem.hasVideo);
    
    // Return true only if all filters match
    return matchesSearch && matchesDifficulty && matchesVideoStatus;
  });

  // Show loading spinner while fetching problems
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-yellow-400"></span>
          <p className="mt-4 text-lg font-semibold text-white">Loading problems and video information...</p>
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
              <Video className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Video Management</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Manage solution videos for coding problems. Upload new videos or delete existing ones.
          </p>
          <div className="mt-4">
            <button
              onClick={() => fetchProblems(true)}
              disabled={loading || refreshLoading}
              className="btn btn-outline btn-primary bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30 transition-all duration-300 gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshLoading ? 'animate-spin' : ''}`} />
              {refreshLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success shadow-lg mb-6 bg-green-500/20 backdrop-blur-md border-green-500/30 text-green-300">
            <CheckCircle className="h-6 w-6" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6 bg-red-500/20 backdrop-blur-md border-red-500/30 text-red-300">
            <AlertTriangle className="h-6 w-6" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <Video className="w-8 h-8" />
            </div>
            <div className="stat-title text-white/70">With Videos</div>
            <div className="stat-value text-green-400">{problems.filter(p => p.hasVideo).length}</div>
          </div>
          
          <div className="stat bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
            <div className="stat-figure text-yellow-400">
              <VideoOff className="w-8 h-8" />
            </div>
            <div className="stat-title text-white/70">Without Videos</div>
            <div className="stat-value text-yellow-400">{problems.filter(p => !p.hasVideo).length}</div>
          </div>
          
          <div className="stat bg-white/10 backdrop-blur-md shadow-xl rounded-2xl border border-white/20">
            <div className="stat-figure text-purple-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div className="stat-title text-white/70">Medium Problems</div>
            <div className="stat-value text-purple-400">{problems.filter(p => p.difficulty?.toLowerCase() === 'medium').length}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-4">
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

            <div className="form-control">
              <div className="input-group">
                <span className="btn btn-square bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <Video className="h-4 w-4" />
                </span>
                <select 
                  className="select select-bordered bg-white/10 backdrop-blur-md border-white/20 text-white focus:bg-white/20 transition-all duration-300"
                  value={filterVideoStatus}
                  onChange={(e) => setFilterVideoStatus(e.target.value)}
                >
                  <option value="all" className="text-black">All Videos</option>
                  <option value="hasVideo" className="text-black">With Video</option>
                  <option value="noVideo" className="text-black">Without Video</option>
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
                  <th className="w-1/4 text-white font-semibold">Title</th>
                  <th className="w-1/8 text-white font-semibold">Difficulty</th>
                  <th className="w-1/6 text-white font-semibold">Video Status</th>
                  <th className="w-1/6 text-white font-semibold">Video Info</th>
                  <th className="w-1/6 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProblems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">
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
                        <div className="flex flex-wrap gap-1 mt-2">
                          {problem.tags?.split(',').map((tag, tagIndex) => (
                            <span key={tagIndex} className="badge badge-outline badge-xs bg-white/10 text-white border-white/30">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getDifficultyColor(problem.difficulty)} gap-2 bg-opacity-20 border border-current/30`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td>
                        {problem.hasVideo ? (
                          <div className="flex items-center gap-2 text-green-400">
                            <Video className="h-4 w-4" />
                            <span className="text-sm font-medium">Has Video</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-yellow-400">
                            <VideoOff className="h-4 w-4" />
                            <span className="text-sm font-medium">No Video</span>
                          </div>
                        )}
                      </td>
                      <td>
                        {problem.hasVideo && problem.videoInfo ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm text-white/80">
                              <Clock className="h-3 w-3" />
                              <span>{formatDuration(problem.videoInfo.duration)}</span>
                            </div>
                            <div className="text-xs text-white/60">
                              {formatDate(problem.videoInfo.uploadedAt)}
                            </div>
                            <div className="flex gap-1">
                              <a 
                                href={problem.videoInfo.secureUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-xs btn-outline btn-primary bg-blue-500/20 border-blue-400/50 text-blue-300 hover:bg-blue-500/30"
                                title="View Video"
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </a>
                              {problem.videoInfo.thumbnailUrl && (
                                <a 
                                  href={problem.videoInfo.thumbnailUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-xs btn-outline btn-secondary bg-purple-500/20 border-purple-400/50 text-purple-300 hover:bg-purple-500/30"
                                  title="View Thumbnail"
                                >
                                  📷
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-white/50 text-sm">No video info</span>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {problem.hasVideo ? (
                            <button 
                              onClick={() => handleDeleteVideo(problem._id, problem.title)}
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
                                  Delete Video
                                </>
                              )}
                            </button>
                          ) : (
                            <NavLink 
                              to={`/admin/upload/${problem._id}`}
                              className="btn btn-sm bg-gradient-to-r from-green-400 to-blue-500 border-0 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 gap-2"
                            >
                              <Video className="h-4 w-4" />
                              Upload Video
                            </NavLink>
                          )}
                        </div>
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
          <p className="text-sm mt-2">
            {problems.filter(p => p.hasVideo).length} with videos • {problems.filter(p => !p.hasVideo).length} without videos
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminVideo;