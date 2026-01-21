import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';
import { Plus, AlertTriangle, CheckCircle, Save, ArrowLeft, X, Code, FileText, TestTube, Settings } from 'lucide-react';
import { useState } from 'react';

// This schema defines the rules for validating the problem data
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
  ).length(3), // Must have exactly 3 languages (c++, java, javascript)
  referenceSolution: z.array( // Array of reference solutions for different languages
    z.object({
      language: z.enum(['c++', 'java', 'javascript']), // Language must be one of these three
      completeCode: z.string().min(1) // Complete solution code must not be empty
    })
  ).length(3) // Must have exactly 3 languages (c++, java, javascript)
});

function AdminPanel() {
  // Hook to navigate to different pages
  const navigate = useNavigate();
  
  // State to show loading spinner while creating the problem
  const [createLoading, setCreateLoading] = useState(false);
  
  // State to store any error messages that occur during creation
  const [error, setError] = useState(null);
  
  // Hook to handle form data, validation, and submission
  // It uses the problemSchema for validation
  const {
    register, // Function to register form inputs
    control, // Object to control form fields
    handleSubmit, // Function to handle form submission
    formState: { errors } // Object containing any validation errors
  } = useForm({
    resolver: zodResolver(problemSchema), // Use Zod for validation
    defaultValues: { // Set default values for the form
      startCode: [ // Default starter code for each language
        { language: 'c++', initialCode: '' },
        { language: 'java', initialCode: '' },
        { language: 'javascript', initialCode: '' }
      ],
      referenceSolution: [ // Default reference solutions for each language
        { language: 'c++', completeCode: '' },
        { language: 'java', completeCode: '' },
        { language: 'javascript', completeCode: '' }
      ]
    }
  });

  // Hook to manage the array of visible test cases
  // This allows adding, removing, and updating test cases dynamically
  const {
    fields: visibleFields, // Array of visible test case fields
    append: appendVisible, // Function to add a new visible test case
    remove: removeVisible // Function to remove a visible test case
  } = useFieldArray({ control, name: 'visibleTestCases' });

  // Hook to manage the array of hidden test cases
  // This allows adding, removing, and updating test cases dynamically
  const {
    fields: hiddenFields, // Array of hidden test case fields
    append: appendHidden, // Function to add a new hidden test case
    remove: removeHidden // Function to remove a hidden test case
  } = useFieldArray({ control, name: 'hiddenTestCases' });

  // Function that runs when the form is submitted
  const onSubmit = async (data) => {
    try {
      // Show loading spinner
      setCreateLoading(true);
      
      // Clear any previous errors
      setError(null);
      
      // Debug: Log the data being sent
      console.log('Sending problem data:', data);
      console.log('Data structure:', {
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        tags: data.tags,
        visibleTestCases: data.visibleTestCases?.length,
        hiddenTestCases: data.hiddenTestCases?.length,
        referenceSolution: data.referenceSolution?.length,
        startCode: data.startCode?.length
      });
      
      // Send the problem data to the server to create a new problem
      await axiosClient.post('/problem/create', data);
      
      // Show success message to the user
      const toast = document.createElement('div');
      toast.className = 'alert alert-success fixed top-4 right-4 z-50 shadow-lg';
      toast.innerHTML = `
        <CheckCircle className="h-6 w-6" />
        <span>Problem "${data.title}" created successfully!</span>
      `;
      document.body.appendChild(toast);
      
      // Remove the success message after 3 seconds
      setTimeout(() => toast.remove(), 3000);
      
      // Navigate back to the admin panel
      navigate('/admin');
    } catch (error) {
      // If there's an error, log it and show error message
      console.error('Create error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to create problem');
    } finally {
      // Hide loading spinner whether success or error
      setCreateLoading(false);
    }
  };

  return (
    // Main container with beautiful gradient background
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Form container with glassmorphism effect */}
      <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-md shadow-2xl rounded-2xl p-8 border border-white/20">
        
        {/* Header section with back button, title, and action buttons */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            {/* Back button to return to admin panel */}
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-circle bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              {/* Page title with gradient text effect */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">Create New Problem</h1>
              <p className="text-white/80">Add a new coding problem to the platform</p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Cancel button to go back without saving */}
            <button 
              onClick={() => navigate('/admin')}
              className="btn btn-outline bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            {/* Submit button to create the problem */}
            <button 
              type="submit"
              form="create-form"
              disabled={createLoading}
              className="btn bg-gradient-to-r from-green-400 to-emerald-500 border-0 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 gap-2"
            >
              {createLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Problem
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message display - shows if there's an error during creation */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6 bg-red-500/20 backdrop-blur-md border-red-500/30 text-red-300">
            <AlertTriangle className="h-6 w-6" />
            <div>
              <h3 className="font-bold">Error!</h3>
              <div className="text-sm">{error}</div>
            </div>
          </div>
        )}
        
        {/* Main form that collects all the problem data */}
        <form id="create-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Section 1: Basic Information about the problem */}
          <div className="card bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <div className="card-body">
              {/* Section header with icon */}
              <h2 className="card-title text-2xl font-semibold text-white mb-4">
                <FileText className="w-6 h-6 mr-2 text-yellow-400" />
                Basic Information
              </h2>
              <div className="grid gap-4">
                
                {/* Problem title input field */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-white">Title</span>
                  </label>
                  <input {...register('title')} placeholder="Problem title" className="input input-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                  {/* Show error message if title is invalid */}
                  {errors.title && <span className="text-red-300 text-sm mt-1">{errors.title.message}</span>}
                </div>

                {/* Problem description textarea */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold text-white">Description</span>
                  </label>
                  <textarea {...register('description')} placeholder="Problem description" rows={4} className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300" />
                  {/* Show error message if description is invalid */}
                  {errors.description && <span className="text-red-300 text-sm mt-1">{errors.description.message}</span>}
                </div>

                {/* Two-column layout for difficulty and category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Difficulty dropdown (Easy, Medium, Hard) */}
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

                  {/* Category dropdown (Array, Linked List, Graph, DP) */}
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
                  <TestTube className="w-6 h-6 mr-2 text-blue-400" />
                  Visible Test Cases
                </h2>
                <button 
                  type="button" 
                  className="btn btn-sm bg-gradient-to-r from-blue-400 to-cyan-500 border-0 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 gap-2" 
                  onClick={() => appendVisible({ input: '', output: '', explanation: '' })}
                >
                  <Plus className="w-4 h-4" />
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
                          <textarea
                            {...register(`visibleTestCases.${index}.input`)}
                            placeholder="Test input"
                            rows={3}
                            className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Expected Output</span>
                          </label>
                          <textarea
                            {...register(`visibleTestCases.${index}.output`)}
                            placeholder="Expected output"
                            rows={3}
                            className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                          />
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
                  <Settings className="w-6 h-6 mr-2 text-purple-400" />
                  Hidden Test Cases
                </h2>
                <button 
                  type="button" 
                  className="btn btn-sm bg-gradient-to-r from-purple-400 to-pink-500 border-0 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 gap-2" 
                  onClick={() => appendHidden({ input: '', output: '' })}
                >
                  <Plus className="w-4 h-4" />
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
                          <textarea
                            {...register(`hiddenTestCases.${index}.input`)}
                            placeholder="Test input"
                            rows={3}
                            className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                          />
                        </div>
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text text-white">Expected Output</span>
                          </label>
                          <textarea
                            {...register(`hiddenTestCases.${index}.output`)}
                            placeholder="Expected output"
                            rows={3}
                            className="textarea textarea-bordered w-full bg-white/10 backdrop-blur-md border-white/20 text-black placeholder-white/50 focus:bg-white/20 transition-all duration-300"
                          />
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
                <Code className="w-6 h-6 mr-2 text-green-400" />
                Code Templates
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[0, 1, 2].map(index => (
                  <div key={index} className="card bg-white/5 backdrop-blur-md shadow-lg border border-white/10">
                    <div className="card-body">
                      <h3 className="card-title text-lg font-bold text-yellow-400 mb-4">
                        {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
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

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/admin')}
              className="btn btn-outline bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={createLoading}
              className="btn bg-gradient-to-r from-green-400 to-emerald-500 border-0 text-white hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 flex-1 gap-2"
            >
              {createLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Problem...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Problem
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
