import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Edit3, AlertTriangle, CheckCircle, Search, Filter, ArrowLeft, Save, X } from 'lucide-react';

// This schema defines the rules for validating the problem data when updating
// It ensures all required fields are present and have the correct format
const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'), // Title must not be empty
  description: z.string().min(1, 'Description is required'), // Description must not be empty
  difficulty: z.enum(['easy', 'medium', 'hard']), // Difficulty must be one of these three values
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']), // Tags must be one of these four values
  visibleTestCases: z.array( // Array of visible test cases
    z.object({
      input: z.string().min(1), // Input must not be empty
      output: z.string().min(1), // Output must not be empty
      explanation: z.string().min(1) // Explanation must not be empty
    })
  ).min(1), // Must have at least one visible test case
  hiddenTestCases: z.array( // Array of hidden test cases
    z.object({
      input: z.string().min(1), // Input must not be empty
      output: z.string().min(1) // Output must not be empty
    })
  ).min(1), // Must have at least one hidden test case
  startCode: z.array( // Array of starter code for different languages
    z.object({
      language: z.enum(['c++', 'java', 'javascript']), // Language must be one of these three
      initialCode: z.string().min(1) // Initial code must not be empty
    })
  ).length(3), // Must have exactly 3 languages (C++, Java, JavaScript)
  referenceSolution: z.array( // Array of reference solutions for different languages
    z.object({
      language: z.enum(['c++', 'java', 'javascript']), // Language must be one of these three
      completeCode: z.string().min(1) // Complete solution code must not be empty
    })
  ).length(3) // Must have exactly 3 languages (C++, Java, JavaScript)
});

const AdminUpdate = () => {
  // State to store all the problems fetched from the server
  const [problems, setProblems] = useState([]);
  
  // State to show loading spinner while fetching problems
  const [loading, setLoading] = useState(true);
  
  // State to store any error messages that occur
  const [error, setError] = useState(null);
  
  // State to store the problem that is currently being edited
  const [selectedProblem, setSelectedProblem] = useState(null);
  
  // State to control whether to show the edit form or the problem list
  const [showEditForm, setShowEditForm] = useState(false);
  
  // State to store the search term for filtering problems
  const [searchTerm, setSearchTerm] = useState('');
  
  // State to store the difficulty filter (all, easy, medium, hard)
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  
  // State to track which problem is currently being updated (to show loading on that specific button)
  const [updateLoading, setUpdateLoading] = useState(null);
  
  // State to store success message
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Hook to navigate to different pages
  const navigate = useNavigate();

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

  // Function to start editing a specific problem
  const handleEdit = async (problem) => {
    try {
      // Fetch the full problem data for editing (including test cases and code)
      const { data } = await axiosClient.get(`/problem/problemById/${problem._id}`);

     
      
      // Store the problem data in state
      setSelectedProblem(data);
      
      // Show the edit form
      setShowEditForm(true);
    } catch (err) {
      // If there's an error, show error message
      setError('Failed to fetch problem details');
      console.error(err);
    }
  };

  // Function to update a problem with new data
  const handleUpdate = async (updatedData) => {
    
    try {
      setUpdateLoading(true);
      await axiosClient.put(`/problem/update/${selectedProblem._id}`, updatedData);
      setSuccessMessage(`Problem "${selectedProblem.title}" updated successfully!`);
      setShowEditForm(false);
      setSelectedProblem(null);
      fetchProblems();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update problem');
      console.error(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Function to cancel editing and go back to the problem list
  const handleCancel = () => {
    setShowEditForm(false); // Hide the edit form
    setSelectedProblem(null); // Clear the selected problem
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

  // If we're editing a problem, show the edit form
  if (showEditForm && selectedProblem) {
    return (
      <EditProblemForm 
        problem={selectedProblem} 
        onUpdate={handleUpdate} 
        onCancel={handleCancel}
        updateLoading={updateLoading}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-4 rounded-2xl mr-4 shadow-lg">
              <Edit3 className="h-8 w-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Update Problems</h1>
          </div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Edit and modify existing coding problems. Update problem details, test cases, and code templates.
          </p>
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
                          onClick={() => handleEdit(problem)}
                          className="btn btn-sm bg-gradient-to-r from-yellow-400 to-orange-500 border-0 text-white hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 gap-2"
                        >
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success shadow-lg mb-6 bg-green-500/20 backdrop-blur-md border-green-500/30 text-green-300 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/50">
          <p>Showing {filteredProblems.length} of {problems.length} problems</p>
        </div>
      </div>
    </div>
  );
};

// Edit Problem Form Component
const EditProblemForm = ({ problem, onUpdate, onCancel, updateLoading }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: problem.title || '',
      description: problem.description || '',
      difficulty: problem.difficulty?.toLowerCase() || 'easy',
      tags: problem.tags || 'array',
      visibleTestCases: problem.visibleTestCases || [{ input: '', output: '', explanation: '' }],
      hiddenTestCases: problem.hiddenTestCases || [{ input: '', output: '' }],
      startCode: problem.startCode || [
        { language: 'c++', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: problem.referenceSolution || [
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible
  } = useFieldArray({ control, name: 'visibleTestCases' });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  const onSubmit = (data) => {
    
    onUpdate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={onCancel}
              className="btn btn-circle bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Edit Problem</h1>
              <p className="text-white/80">Update problem details and configurations</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onCancel}
              className="btn btn-outline bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button 
              type="submit"
              form="edit-form"
              disabled={updateLoading}
              className="btn bg-gradient-to-r from-yellow-400 to-orange-500 border-0 text-white hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 gap-2"
            >
              {updateLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Problem
                </>
              )}
            </button>
          </div>
        </div>
        
        <form id="edit-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <div className="card-body">
              <h2 className="card-title text-2xl font-semibold text-white mb-4">
                <svg className="w-6 h-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Basic Information
              </h2>
              <div className="grid gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-white">Title</span>
                  </label>
                  <input {...register('title')} placeholder="Problem title" className="input input-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                  {errors.title && <span className="text-red-300 text-sm mt-1">{errors.title.message}</span>}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-white">Description</span>
                  </label>
                  <textarea {...register('description')} placeholder="Problem description" rows={4} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                  {errors.description && <span className="text-red-300 text-sm mt-1">{errors.description.message}</span>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-white">Difficulty</span>
                    </label>
                    <select {...register('difficulty')} className="select select-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black focus:bg-white/20 transition-all duration-300">
                      <option value="easy" className="text-black">Easy</option>
                      <option value="medium" className="text-black">Medium</option>
                      <option value="hard" className="text-black">Hard</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-white">Category</span>
                    </label>
                    <select {...register('tags')} className="select select-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black focus:bg-white/20 transition-all duration-300">
                      <option value="array" className="text-black">Array</option>
                      <option value="linkedList" className="text-black">Linked List</option>
                      <option value="graph" className="text-black">Graph</option>
                      <option value="dp" className="text-black">DP</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visible Test Cases */}
          <div className="card bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-2xl font-semibold text-white">
                  <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Visible Test Cases
                </h2>
                <button 
                  type="button" 
                  className="btn btn-sm bg-gradient-to-r from-blue-400 to-cyan-500 border-0 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 gap-2" 
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Case
                </button>
              </div>
              
              <div className="space-y-4">
                {visibleFields.map((field, index) => (
                  <div key={field.id} className="card bg-white/5 backdrop-blur-md shadow-lg border border-white/10">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Test Case {index + 1}</h3>
                        <button 
                          type="button" 
                          className="btn btn-xs bg-gradient-to-r from-red-400 to-pink-500 border-0 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 gap-1" 
                          onClick={() => removeVisible(index)}
                        >
                          <X className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Input</span>
                          </label>
                          <textarea {...register(`visibleTestCases.${index}.input`)} placeholder="Test input" rows={3} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Expected Output</span>
                          </label>
                          <textarea {...register(`visibleTestCases.${index}.output`)} placeholder="Expected output" rows={3} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                        </div>
                      </div>
                      
                      <div className="form-control mt-4">
                        <label className="label">
                          <span className="label-text text-white">Explanation</span>
                        </label>
                        <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Test case explanation" className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hidden Test Cases */}
          <div className="card bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title text-2xl font-semibold text-white">
                  <svg className="w-6 h-6 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Hidden Test Cases
                </h2>
                <button 
                  type="button" 
                  className="btn btn-sm bg-gradient-to-r from-purple-400 to-pink-500 border-0 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 gap-2" 
                  onClick={() => appendHidden({ input: '', output: '' })}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Case
                </button>
              </div>
              
              <div className="space-y-4">
                {hiddenFields.map((field, index) => (
                  <div key={field.id} className="card bg-white/5 backdrop-blur-md shadow-lg border border-white/10">
                    <div className="card-body">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">Hidden Test Case {index + 1}</h3>
                        <button 
                          type="button" 
                          className="btn btn-xs bg-gradient-to-r from-red-400 to-pink-500 border-0 text-white hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 gap-1" 
                          onClick={() => removeHidden(index)}
                        >
                          <X className="h-3 w-3" />
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Input</span>
                          </label>
                          <textarea {...register(`hiddenTestCases.${index}.input`)} placeholder="Test input" rows={3} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Expected Output</span>
                          </label>
                          <textarea {...register(`hiddenTestCases.${index}.output`)} placeholder="Expected output" rows={3} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Code Templates */}
          <div className="card bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <div className="card-body">
              <h2 className="card-title text-2xl font-semibold text-white mb-6">
                <svg className="w-6 h-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
                Code Templates
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map(index => (
                  <div key={index} className="card bg-white/5 backdrop-blur-md shadow-lg border border-white/10">
                    <div className="card-body">
                      <h3 className="card-title text-lg font-bold text-yellow-400 mb-4">
                        {index === 0 ? 'c++' : index === 1 ? 'java' : 'javascript'}
                      </h3>
                      
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-semibold text-white">Initial Code</span>
                        </label>
                        <textarea 
                          {...register(`startCode.${index}.initialCode`)} 
                          rows={6} 
                          placeholder="Initial code template" 
                          className="textarea textarea-bordered w-full font-mono text-sm bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" 
                        />
                      </div>
                      
                      <div className="form-control mt-4">
                        <label className="label">
                          <span className="label-text font-semibold text-white">Reference Solution</span>
                        </label>
                        <textarea 
                          {...register(`referenceSolution.${index}.completeCode`)} 
                          rows={8} 
                          placeholder="Complete solution code" 
                          className="textarea textarea-bordered w-full font-mono text-sm bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdate;