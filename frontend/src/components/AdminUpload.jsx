import { useParams } from 'react-router';
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import axiosClient from '../utils/axiosClient'
import { X, Upload, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

function AdminUpload(){
    
    const {problemId}  = useParams();
    
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedVideo, setUploadedVideo] = useState(null);
    const [canceling, setCanceling] = useState(false);
    
    // Ref to store the AbortController for canceling uploads
    const abortControllerRef = useRef(null);
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
        setError,
        clearErrors,
        setValue
    } = useForm();
    
    const selectedFile = watch('videoFile')?.[0];
    
    // Clear success message when a new file is selected
    React.useEffect(() => {
        if (selectedFile && uploadedVideo) {
            setUploadedVideo(null);
        }
    }, [selectedFile, uploadedVideo]);
    
    // Function to cancel file selection (before upload)
    const handleCancelFile = () => {
        // Clear the file input
        setValue('videoFile', null);
        // Reset the form
        reset();
        // Clear any errors
        clearErrors();
        // Clear success message
        setUploadedVideo(null);
    };
    
    // Function to cancel upload (during upload)
    const handleCancelUpload = () => {
        if (abortControllerRef.current) {
            setCanceling(true);
            
            // Abort the current upload
            abortControllerRef.current.abort();
            
            // Reset states
            setTimeout(() => {
                setUploading(false);
                setUploadProgress(0);
                setCanceling(false);
                abortControllerRef.current = null;
                clearErrors();
            }, 1000);
        }
    };
    
    // Upload video to Cloudinary
    const onSubmit = async (data) => {
        const file = data.videoFile[0];
        
        setUploading(true);
        setUploadProgress(0);
        setCanceling(false);
        clearErrors();
        
        // Create new AbortController for this upload
        abortControllerRef.current = new AbortController();
    
        try {
            console.log('Starting upload process for problemId:', problemId);
            
            // Step 1: Get upload signature from backend
            const signatureResponse = await axiosClient.get(`/video/create/${problemId}`, {
                signal: abortControllerRef.current.signal
            });
            console.log('Signature response:', signatureResponse.data);
            const { signature, timestamp, public_id, api_key, cloud_name, upload_url } = signatureResponse.data;
    
            // Step 2: Create FormData for Cloudinary upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('signature', signature);
            formData.append('timestamp', timestamp);
            formData.append('public_id', public_id);
            formData.append('api_key', api_key);
    
            // Step 3: Upload directly to Cloudinary
            console.log('Uploading to Cloudinary URL:', upload_url);
            const uploadResponse = await axios.post(upload_url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal: abortControllerRef.current.signal,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                },
            });
            console.log('Cloudinary upload response:', uploadResponse.data);
    
            const cloudinaryResult = uploadResponse.data;
    
            // Step 4: Save video metadata to backend
            console.log('Saving metadata to backend:', {
                problemId: problemId,
                cloudinaryPublicId: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url,
                duration: cloudinaryResult.duration,
            });
            const metadataResponse = await axiosClient.post('/video/save', {
                problemId: problemId,
                cloudinaryPublicId: cloudinaryResult.public_id,
                secureUrl: cloudinaryResult.secure_url,
                duration: cloudinaryResult.duration,
            }, {
                signal: abortControllerRef.current.signal
            });
            console.log('Metadata save response:', metadataResponse.data);
    
            setUploadedVideo(metadataResponse.data.videoSolution);
            reset(); // Reset form after successful upload
            
        } catch (err) {
            // Check if the error is due to cancellation
            if (err.name === 'CanceledError' || err.message === 'canceled') {
                console.log('Upload was canceled by user');
                return;
            }
            
            console.error('Upload error:', err);
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || 'Upload failed. Please try again.';
            setError('root', {
                type: 'manual',
                message: errorMessage
            });
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setCanceling(false);
            abortControllerRef.current = null;
        }
    };
    
    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    // Format duration
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md glass p-8 rounded-2xl shadow-2xl backdrop-blur-sm bg-white/10 border border-white/20">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-yellow-300 mb-2 drop-shadow-md tracking-wide">
                        Video Upload
                    </h1>
                    <p className="text-white/80 text-sm">Upload solution videos for problem {problemId}</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* File Input */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text text-white font-semibold">Choose video file</span>
                        </label>
                        <input
                            type="file"
                            accept="video/*"
                            {...register('videoFile', {
                                required: 'Please select a video file',
                                validate: {
                                    isVideo: (files) => {
                                        if (!files || !files[0]) return 'Please select a video file';
                                        const file = files[0];
                                        return file.type.startsWith('video/') || 'Please select a valid video file';
                                    },
                                    fileSize: (files) => {
                                        if (!files || !files[0]) return true;
                                        const file = files[0];
                                        const maxSize = 100 * 1024 * 1024; // 100MB
                                        return file.size <= maxSize || 'File size must be less than 100MB';
                                    }
                                }
                            })}
                            className={`file-input file-input-bordered w-full bg-white/80 text-black border-white/30 hover:bg-white/90 transition-all duration-300 ${errors.videoFile ? 'file-input-error border-red-400' : ''}`}
                            disabled={uploading}
                        />
                        {errors.videoFile && (
                            <label className="label">
                                <span className="label-text-alt text-red-300 font-medium">{errors.videoFile.message}</span>
                            </label>
                        )}
                    </div>
        
                    {/* Selected File Info with Cancel Option */}
                    {selectedFile && (
                        <div className="bg-blue-500/20 border border-blue-400/50 text-blue-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="font-bold text-blue-200">Selected File:</h3>
                                    <p className="text-sm text-blue-100">{selectedFile.name}</p>
                                    <p className="text-sm text-blue-100">Size: {formatFileSize(selectedFile.size)}</p>
                                </div>
                                {!uploading && (
                                    <button
                                        type="button"
                                        onClick={handleCancelFile}
                                        className="btn btn-sm btn-circle btn-outline bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 hover:border-red-400 transition-all duration-300 ml-2"
                                        title="Remove selected file"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
        
                    {/* Upload Progress */}
                    {uploading && (
                        <div className="space-y-3 bg-purple-500/20 border border-purple-400/50 p-4 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between text-sm text-purple-200 font-medium">
                                <span>{canceling ? 'Canceling...' : 'Uploading...'}</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-purple-900/50 rounded-full h-2 overflow-hidden">
                                <div 
                                    className={`h-2 rounded-full transition-all duration-300 ease-out ${
                                        canceling 
                                            ? 'bg-gradient-to-r from-red-400 to-orange-400' 
                                            : 'bg-gradient-to-r from-purple-400 to-pink-400'
                                    }`}
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
        
                    {/* Error Message */}
                    {errors.root && (
                        <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                <span className="font-medium">{errors.root.message}</span>
                            </div>
                        </div>
                    )}
        
                    {/* Success Message */}
                    {uploadedVideo && (
                        <div className="bg-green-500/20 border border-green-400/50 text-green-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                <div>
                                    <h3 className="font-bold text-green-200">Upload Successful!</h3>
                                    <p className="text-sm text-green-100">Duration: {formatDuration(uploadedVideo.duration)}</p>
                                    <p className="text-sm text-green-100">Uploaded: {new Date(uploadedVideo.uploadedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
        
                    {/* Action Buttons */}
                    <div className="flex justify-between pt-4">
                        {/* Cancel Button - Show during upload OR when file is selected but not uploading */}
                        {(uploading || (selectedFile && !uploading)) && (
                            <button
                                type="button"
                                onClick={uploading ? handleCancelUpload : handleCancelFile}
                                disabled={canceling}
                                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                                    canceling 
                                        ? 'bg-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg hover:shadow-red-500/25'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    {uploading ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                                    {canceling ? 'Canceling...' : (uploading ? 'Cancel Upload' : 'Cancel')}
                                </div>
                            </button>
                        )}
                        
                        {/* Upload Button */}
                        <button
                            type="submit"
                            disabled={uploading || !selectedFile}
                            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                                uploading || !selectedFile
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                            }`}
                        >
                            {uploading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Uploading...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    Upload Video
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AdminUpload;