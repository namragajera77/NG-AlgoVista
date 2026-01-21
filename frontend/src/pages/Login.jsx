import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {loginUser} from "../authSlice"
import { useEffect } from 'react';


const loginSchema = z.object({
  emailid: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
});


function Login() {

   const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted }
  } = useForm({ 
    resolver: zodResolver(loginSchema),
    mode: "onChange" // Enable real-time validation
  });

  const [showPassword, setShowPassword] = useState(false);

useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(loginUser(data));
  };

  // Determine what error message to show
  const getErrorMessage = () => {
    // If there are form validation errors, show them
    if (errors.emailid || errors.password) {
      return null; // Let individual field errors show
    }
    
    // If there's a server error and form was submitted, show "Invalid credentials"
    if (error && isSubmitted) {
      return "Invalid credentials";
    }
    
    return null;
  };

  const displayError = getErrorMessage();


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md glass p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-white/10">

        <h1 className="text-5xl font-bold text-yellow-300 text-center mb-2 drop-shadow-md tracking-wide">
          LeetCode
        </h1>

        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Display authentication error */}
          {displayError && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{displayError}</p>
            </div>
          )}

          {/* email */}
          <div>
            <input
              type="email"
              {...register("emailid")}
              placeholder="Email Address"
              className="input input-bordered w-full bg-white/80 text-black"
            />
            {errors.emailid && (
              <p className="text-red-500 text-sm mt-1">{errors.emailid.message}</p>
            )}
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="Password"
              className="input input-bordered w-full bg-white/80 text-black pr-10"
            />
            <span
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "👁️" : "🙈"}
            </span>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

            {/* submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full hover:scale-105 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-white mt-4">
          Don't have an account? <a href="/signup" className="underline">Sign up</a>
        </p>


      </div>
    </div>
  );
}

export default Login;
