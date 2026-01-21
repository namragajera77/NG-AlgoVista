import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {registerUser} from '../authSlice'
import { useEffect } from 'react';

// Zod validation schema
const signUpSchema = z
  .object({
    firstname: z.string().min(3, "Name must be at least 3 characters"),
    emailid: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);


  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated,navigate]);

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}


const onSubmit = (data) => {
  const payload = {
    firstname: data.firstname,
    emailid: data.emailid,
    password: data.password
  };

  dispatch(registerUser(payload));
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-xl glass p-8 rounded-2xl shadow-xl backdrop-blur-sm bg-white/10">

        {/* LeetCode Title */}
        <h1 className="text-5xl font-bold text-yellow-300 text-center mb-2 drop-shadow-md tracking-wide">
          LeetCode
        </h1>
        <h2 className="text-4xl font-extrabold text-center text-white mb-6">Sign Up</h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* First Name */}
          <div>
            <input
              {...register('firstname')}
              placeholder="Enter your name"
              className="input input-bordered w-full bg-white/80 text-black"
            />
            {errors.firstname && <p className="text-red-500 text-sm mt-1">{errors.firstname.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              {...register('emailid')}
              placeholder="Enter your email"
              className="input input-bordered w-full bg-white/80 text-black"
              type="email"
            />
            {errors.emailid && <p className="text-red-500 text-sm mt-1">{errors.emailid.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register('password')}
              placeholder="Enter your password"
              className="input input-bordered w-full bg-white/80 text-black pr-10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ?   "👁️" : "🙈"}
            </span>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register('confirmPassword')}
              placeholder="Confirm your password"
              className="input input-bordered w-full bg-white/80 text-black pr-10"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              title={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? "👁️" : "🙈"}
            </span>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary w-full hover:scale-105 transition-transform duration-300 
            ${loading ? 'loading' : ''}`} disabled={loading}>
          
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-white mt-4 text-sm">
          Already have an account? <a href="/login" className="underline">Login</a>
        </p>
      </div>
    </div>
  );
}

export default Signup;
