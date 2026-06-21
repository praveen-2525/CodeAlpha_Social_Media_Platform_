import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Protected
export const createPost = async (req, res, next) => {
  const { caption } = req.body;

  try {
    if (!caption) {
      res.status(400);
      throw new Error('Caption is required');
    }

    let imageUrl = '';

    // If post contains an image file
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'posts');
        imageUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Post Upload Error:', uploadError);
        res.status(500);
        throw new Error('Failed to upload image to Cloudinary');
      }
    }

    const post = await Post.create({
      user: req.user._id,
      caption,
      image: imageUrl,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'user',
      'username profilePic'
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Get social feed (posts from self and followed users) with pagination
// @route   GET /api/posts/feed
// @access  Protected
export const getFeed = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  try {
    const currentUser = await User.findById(req.user._id);

    // Feed includes user's own posts and posts of people they follow
    const feedUserIds = [currentUser._id, ...currentUser.following];

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ user: { $in: feedUserIds } });

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      hasMore: page * limit < totalPosts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get posts by user's username
// @route   GET /api/posts/user/:username
// @access  Protected
export const getUserPosts = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const posts = await Post.find({ user: user._id })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Protected
export const updatePost = async (req, res, next) => {
  const { caption } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if post belongs to logged-in user
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to edit this post');
    }

    post.caption = caption || post.caption;
    const updatedPost = await post.save();
    
    const populatedPost = await Post.findById(updatedPost._id).populate(
      'user',
      'username profilePic'
    );

    res.json(populatedPost);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Protected
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if post belongs to logged-in user
    if (post.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to delete this post');
    }

    // Delete post comments first to avoid dangling records
    await Comment.deleteMany({ post: post._id });

    // Delete the post
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post and its comments deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Protected
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if user already liked this post
    if (post.likes.includes(req.user._id)) {
      res.status(400);
      throw new Error('Post already liked');
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ message: 'Post liked successfully', likes: post.likes });
  } catch (error) {
    next(error);
  }
};

// @desc    Unlike a post
// @route   POST /api/posts/:id/unlike
// @access  Protected
export const unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    // Check if user has not liked this post
    if (!post.likes.includes(req.user._id)) {
      res.status(400);
      throw new Error('Post has not been liked yet');
    }

    post.likes = post.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    );
    await post.save();

    res.json({ message: 'Post unliked successfully', likes: post.likes });
  } catch (error) {
    next(error);
  }
};
