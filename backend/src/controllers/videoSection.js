const cloudinary = require('cloudinary').v2;
const Problem = require("../models/problem");
const User = require("../models/user");
const SolutionVideo = require("../models/solutionVideo");
const { sanitizeFilter } = require('mongoose');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log Cloudinary configuration (without sensitive data)
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' : 'NOT_SET',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'NOT_SET'
});

const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    
    const userId = req.result._id;
    console.log('Generating upload signature for problemId:', problemId, 'userId:', userId);
    
    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;
    
    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    const responseData = {
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    };
    
    console.log('Generated upload signature response:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials', details: error.message });
  }
};


const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemId,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userId = req.result._id;
    console.log('Saving video metadata:', { problemId, cloudinaryPublicId, secureUrl, duration, userId });

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }

    // Check if video already exists for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemId,
      userId,
      cloudinaryPublicId
    });

    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

    // const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
    // resource_type: 'image',  
    // transformation: [
    // { width: 400, height: 225, crop: 'fill' },
    // { quality: 'auto' },
    // { start_offset: 'auto' }  
    // ],
    // format: 'jpg'
    // });

    const thumbnailUrl = cloudinary.image(cloudinaryResource.public_id,{resource_type: "video"})

    // Create video solution record
    const videoSolution = await SolutionVideo.create({
      problemId,
      userId,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    });


    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: videoSolution._id,
        thumbnailUrl: videoSolution.thumbnailUrl,
        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata', details: error.message });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;

    // Validate problemId
    if (!problemId) {
      return res.status(400).json({ error: 'Problem ID is required' });
    }

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Find the video to delete
    const video = await SolutionVideo.findOne({ problemId: problemId });
    
    if (!video) {
      return res.status(404).json({ error: 'No video found for this problem' });
    }

    // Delete from Cloudinary first
    try {
      await cloudinary.uploader.destroy(video.cloudinaryPublicId, { 
        resource_type: 'video', 
        invalidate: true 
      });
      console.log(`Video deleted from Cloudinary: ${video.cloudinaryPublicId}`);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
      // This prevents orphaned database records
    }

    // Delete from database
    await SolutionVideo.findByIdAndDelete(video._id);

    res.json({ 
      message: 'Video deleted successfully',
      deletedVideo: {
        problemId: video.problemId,
        cloudinaryPublicId: video.cloudinaryPublicId
      }
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    
    // Provide more specific error messages
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid problem ID format' });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete video',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {generateUploadSignature,saveVideoMetadata,deleteVideo};