import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAI from '../components/ChatAI';
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

  const { handleSubmit } = useForm();

  // Helper functions for localStorage
  const getStorageKey = (key) => `problem_${problemId}_${key}`;
  
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(getStorageKey(key), JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };
  
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(getStorageKey(key));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
      return defaultValue;
    }
  };

  // Load persisted state on component mount
  useEffect(() => {
    const persistedLanguage = loadFromStorage('selectedLanguage', 'javascript');
    const persistedLeftTab = loadFromStorage('activeLeftTab', 'description');
    const persistedRightTab = loadFromStorage('activeRightTab', 'code');
    
    setSelectedLanguage(persistedLanguage);
    setActiveLeftTab(persistedLeftTab);
    setActiveRightTab(persistedRightTab);
  }, [problemId]);

  // Save state changes to localStorage
  useEffect(() => {
    saveToStorage('selectedLanguage', selectedLanguage);
  }, [selectedLanguage, problemId]);

  useEffect(() => {
    saveToStorage('activeLeftTab', activeLeftTab);
  }, [activeLeftTab, problemId]);

  useEffect(() => {
    saveToStorage('activeRightTab', activeRightTab);
  }, [activeRightTab, problemId]);




  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
        
        // Load persisted code for the current language, or use initial code
        const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        
        setProblem(response.data);
        
        // Use persisted code if available, otherwise use initial code
        setCode(persistedCode || initialCode);
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      // Load persisted code for the new language, or use initial code
      const persistedCode = loadFromStorage(`code_${selectedLanguage}`, '');
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(persistedCode || initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    const newCode = value || '';
    setCode(newCode);
    // Save code to localStorage for the current language
    saveToStorage(`code_${selectedLanguage}`, newCode);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage
      });

      console.log(response)

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code:code,
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-white/20">
        {/* Enhanced Left Tabs */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-2 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeLeftTab === 'description' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveLeftTab('description')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">📝</span>
                  <span>Description</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeLeftTab === 'editorial' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveLeftTab('editorial')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">📚</span>
                  <span>Editorial</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeLeftTab === 'solutions' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveLeftTab('solutions')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">💡</span>
                  <span>Solutions</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeLeftTab === 'submissions' 
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveLeftTab('submissions')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">📊</span>
                  <span>Submissions</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeLeftTab === 'chatAI' 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveLeftTab('chatAI')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">🤖</span>
                  <span>ChatAI</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {problem && (
            <>
              {activeLeftTab === 'description' && (
                <div className="space-y-6">
                  {/* Header Section */}
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-4 mb-4">
                                              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xl">📝</span>
                        </div>
                        <div className="flex-1">
                          <h1 className="text-3xl font-bold text-white mb-2">{problem.title}</h1>
                          <div className="flex items-center gap-3">
                            <div className={`badge badge-lg ${getDifficultyColor(problem.difficulty)} gap-2 bg-opacity-20 border border-current/30`}>
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                            </div>
                            <div className="badge badge-info badge-lg gap-2 bg-blue-500/20 text-blue-300 border-blue-500/30">
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              {problem.tags}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📖</span>
                      </div>
                      <h2 className="text-xl font-bold text-white">Problem Description</h2>
                    </div>
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-base leading-relaxed text-white/80 bg-white/5 p-4 rounded-lg border border-white/20">
                        {problem.description}
                      </div>
                    </div>
                  </div>

                  {/* Examples Section */}
                  <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🧪</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">Examples</h3>
                    </div>
                    <div className="space-y-4">
                      {problem.visibleTestCases.map((example, index) => (
                        <div key={index} className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-orange-600 font-bold">Example {index + 1}</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-orange-200 to-transparent"></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white dark:bg-base-200 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-orange-600">📥</span>
                                <span className="font-semibold text-orange-800">Input</span>
                              </div>
                              <pre className="font-mono text-xs bg-gray-800 text-white p-2 rounded whitespace-pre-wrap">
                                {example.input}
                              </pre>
                            </div>
                            <div className="bg-white dark:bg-base-200 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-orange-600">📤</span>
                                <span className="font-semibold text-orange-800">Output</span>
                              </div>
                              <pre className="font-mono text-xs bg-gray-800 text-white p-2 rounded whitespace-pre-wrap">
                                {example.output}
                              </pre>
                            </div>
                            <div className="bg-white dark:bg-base-200 p-3 rounded-lg border border-orange-200 dark:border-orange-800 md:col-span-3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-orange-600">💡</span>
                                <span className="font-semibold text-orange-800">Explanation</span>
                              </div>
                              <div className="text-xs text-base-content/80 bg-base-100 p-2 rounded whitespace-pre-wrap">
                                {example.explanation}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'editorial' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">📚</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Editorial</h2>
                          <p className="text-sm text-white/70">Detailed explanation and approach analysis</p>
                        </div>
                         
                    </div>
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                            <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                          </div>
                  </div>


                    
                  
                
              )}

              {activeLeftTab === 'solutions' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">💡</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Solutions</h2>
                          <p className="text-sm text-white/70">Reference solutions for this problem</p>
                        </div>
                    </div>
                  </div>

                  {/* Solutions Content */}
                  <div className="space-y-6">
                    {problem.referenceSolution?.map((solution, index) => (
                      <div key={index} className="bg-white dark:bg-base-300 rounded-xl shadow-lg border border-base-300 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">🔧</span>
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-lg">{problem?.title}</h3>
                                <p className="text-emerald-100 text-sm">Reference Solution</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-sm font-semibold">{solution?.language}</span>
                              </div>
                              <div className="bg-white/20 px-3 py-1 rounded-full">
                                <span className="text-white text-sm">#{index + 1}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-4 shadow-inner">
                            <pre className="text-emerald-400 text-sm overflow-x-auto font-mono leading-relaxed">
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-2xl">🔒</span>
                        </div>
                        <h3 className="text-lg font-semibold text-base-content mb-2">Solutions Locked</h3>
                        <p className="text-base-content/70 mb-4">
                          Solutions will be available after you solve the problem.
                        </p>
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            💡 Tip: Try solving the problem first, then compare your solution with the reference implementation.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeLeftTab === 'submissions' && (
                <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-2xl">
                    <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg">📊</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">My Submissions</h2>
                          <p className="text-sm text-white/70">Track your submission history and performance</p>
                        </div>
                    </div>
                  </div>

                  {/* Submissions Content */}
                  <div className="bg-white dark:bg-base-300 rounded-xl shadow-lg p-6 border border-base-300">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📈</span>
                      </div>
                      <h3 className="text-lg font-bold text-base-content">Submission History</h3>
                    </div>
                    <div className="text-base-content/80">
                      <SubmissionHistory problemId={problemId} />
                    </div>
                  </div>
                </div>
              )}

              {activeLeftTab === 'chatAI' && (
                <div className="h-full">
                  <ChatAI problem={problem} problemId={problemId} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {/* Enhanced Right Tabs */}
        <div className="bg-white/10 backdrop-blur-md px-6 py-2 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeRightTab === 'code' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveRightTab('code')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">💻</span>
                  <span>Code</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeRightTab === 'testcase' 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveRightTab('testcase')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">🧪</span>
                  <span>Testcase</span>
                </span>
              </button>
              <button 
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  activeRightTab === 'result' 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-white shadow-lg' 
                    : 'text-white/70 hover:text-white hover:bg-white/20'
                }`}
                onClick={() => setActiveRightTab('result')}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">🏆</span>
                  <span>Result</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          {activeRightTab === 'code' && (
            <div className="flex-1 flex flex-col">
              {/* Enhanced Language Selector */}
              <div className="flex justify-between items-center p-4 border-b border-white/20 bg-white/10 backdrop-blur-md">
                <div className="flex gap-2">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button
                      key={lang}
                      className={`btn btn-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        selectedLanguage === lang 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg border-0' 
                          : 'btn-ghost text-white/70 hover:text-white hover:bg-white/20 border-white/20'
                      }`}
                      onClick={() => handleLanguageChange(lang)}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Monaco Editor */}
              <div className="flex-1 relative bg-white/5">
                <div className="h-full rounded-lg shadow-2xl border border-white/20 overflow-hidden">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                    }}
                  />
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="p-4 border-t border-white/20 bg-white/10 backdrop-blur-md flex justify-between items-center">
                <div className="flex gap-2">
                  <button 
                    className="btn btn-ghost btn-sm gap-2 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200"
                    onClick={() => setActiveRightTab('testcase')}
                  >
                    <span className="text-sm">📟</span>
                    Console
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    className={`btn btn-outline btn-sm gap-2 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      loading ? 'loading' : ''
                    }`}
                    onClick={handleRun}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <span className="text-sm">▶️</span>
                    )}
                    Run
                  </button>
                  <button
                    className={`btn btn-sm gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      loading ? 'loading' : ''
                    }`}
                    onClick={handleSubmitCode}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <span className="text-sm">🚀</span>
                    )}
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeRightTab === 'testcase' && (
            <div className="flex-1 p-6 overflow-y-auto bg-white/5">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
                                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🧪</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Test Results</h3>
                      <p className="text-sm text-white/70">Code execution and test case validation</p>
                    </div>
                  </div>
                
                {runResult ? (
                  <div className={`alert ${runResult.success ? 'alert-success' : 'alert-error'} mb-6 shadow-lg border-0`}>
                    <div className="w-full">
                      {runResult.success ? (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-lg">✅</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-green-800">All test cases passed!</h4>
                              <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">⏱️ Runtime:</span>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {runResult.runtime} sec
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">💾 Memory:</span>
                                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                    {runResult.memory} KB
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 space-y-3">
                            <h5 className="font-semibold text-base-content">Test Cases:</h5>
                                                         {runResult.testCases.map((tc, i) => (
                               <div key={i} className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                                 <div className="font-mono text-sm space-y-2">
                                   <div className="flex items-center gap-2">
                                     <span className="text-green-600 font-bold">✓</span>
                                     <span className="font-medium">Test Case {i + 1}</span>
                                   </div>
                                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                     <div>
                                       <span className="font-semibold text-gray-600">Input:</span>
                                       <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                         {tc.stdin}
                                       </div>
                                     </div>
                                     <div>
                                       <span className="font-semibold text-gray-600">Expected:</span>
                                       <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                         {tc.expected_output}
                                       </div>
                                     </div>
                                     <div>
                                       <span className="font-semibold text-gray-600">Output:</span>
                                       <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                         {tc.stdout}
                                       </div>
                                     </div>
                                   </div>
                                   <div className="text-green-600 font-semibold flex items-center gap-2">
                                     <span>✓</span>
                                     <span>Passed</span>
                                   </div>
                                 </div>
                               </div>
                             ))}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-lg">❌</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-lg text-red-800">Test cases failed</h4>
                              <p className="text-sm text-red-600">Some test cases did not pass</p>
                            </div>
                          </div>
                          
                          <div className="mt-6 space-y-3">
                            <h5 className="font-semibold text-base-content">Test Cases:</h5>
                            {runResult.testCases.map((tc, i) => (
                              <div key={i} className={`p-4 rounded-lg border ${
                                tc.status_id == 3 
                                  ? 'bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800'
                                  : 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800'
                              }`}>
                                <div className="font-mono text-sm space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className={tc.status_id == 3 ? 'text-green-600' : 'text-red-600'}>
                                      {tc.status_id == 3 ? '✓' : '✗'}
                                    </span>
                                    <span className="font-medium">Test Case {i + 1}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                    <div>
                                      <span className="font-semibold text-gray-600">Input:</span>
                                      <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                        {tc.stdin}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-600">Expected:</span>
                                      <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                        {tc.expected_output}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-600">Output:</span>
                                      <div className="bg-gray-800 dark:bg-gray-900 p-2 rounded mt-1 font-mono text-white">
                                        {tc.stdout}
                                      </div>
                                    </div>
                                  </div>
                                  <div className={`font-semibold flex items-center gap-2 ${
                                    tc.status_id == 3 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    <span>{tc.status_id == 3 ? '✓' : '✗'}</span>
                                    <span>{tc.status_id == 3 ? 'Passed' : 'Failed'}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🧪</span>
                    </div>
                    <h4 className="text-lg font-semibold text-base-content mb-2">Ready to Test</h4>
                    <p className="text-base-content/70">
                      Click "Run" to test your code with the example test cases.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeRightTab === 'result' && (
            <div className="flex-1 p-6 overflow-y-auto bg-white/5">
              <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-6 border border-white/20">
                                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg">🏆</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Submission Result</h3>
                      <p className="text-sm text-white/70">Final evaluation and performance metrics</p>
                    </div>
                  </div>
                
                {submitResult ? (
                  <div className={`alert ${submitResult.accepted ? 'alert-success' : 'alert-error'} mb-6 shadow-lg border-0`}>
                    <div className="w-full">
                      {submitResult.accepted ? (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-2xl">🎉</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-2xl text-green-800">Accepted!</h4>
                              <p className="text-green-600">Congratulations! Your solution is correct.</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-green-600">✅</span>
                                <span className="font-semibold text-green-800">Test Cases</span>
                              </div>
                              <div className="text-2xl font-bold text-green-800">
                                {submitResult.passedTestCases}/{submitResult.totalTestCases}
                              </div>
                              <div className="text-sm text-green-600">Passed</div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-blue-600">⏱️</span>
                                <span className="font-semibold text-blue-800">Runtime</span>
                              </div>
                              <div className="text-2xl font-bold text-blue-800">
                                {submitResult.runtime}
                              </div>
                              <div className="text-sm text-blue-600">seconds</div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-purple-600">💾</span>
                                <span className="font-semibold text-purple-800">Memory</span>
                              </div>
                              <div className="text-2xl font-bold text-purple-800">
                                {submitResult.memory}
                              </div>
                              <div className="text-sm text-purple-600">KB</div>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-yellow-600">🏅</span>
                              <span className="font-semibold text-yellow-800">Performance</span>
                            </div>
                            <div className="text-sm text-yellow-700">
                              Your solution is efficient and well-optimized! Great job on solving this problem.
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-2xl">❌</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-2xl text-red-800">{submitResult.error}</h4>
                              <p className="text-red-600">Your solution needs some adjustments.</p>
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-red-600">📊</span>
                              <span className="font-semibold text-red-800">Test Results</span>
                            </div>
                            <div className="text-2xl font-bold text-red-800 mb-2">
                              {submitResult.passedTestCases}/{submitResult.totalTestCases}
                            </div>
                            <div className="text-sm text-red-600">
                              Test cases passed. Keep trying to improve your solution!
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-orange-600">💡</span>
                              <span className="font-semibold text-orange-800">Tips</span>
                            </div>
                            <div className="text-sm text-orange-700">
                              Review your logic, check edge cases, and consider different approaches. 
                              You can also use the AI assistant for hints!
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🏆</span>
                    </div>
                    <h4 className="text-lg font-semibold text-base-content mb-2">Ready to Submit</h4>
                    <p className="text-base-content/70">
                      Click "Submit" to submit your solution for final evaluation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;


