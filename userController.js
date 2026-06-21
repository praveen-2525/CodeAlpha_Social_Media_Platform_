import User from '../models/User.js';
import { uploadToCloudinary } from '../config/cloudinary.js';

// @desc    Get user profile by username
// @route   GET /api/users/profile/:username
// @access  Protected
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username profilePic bio')
      .populate('following', 'username profilePic bio');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Protected
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Update basic text fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    // Check if new password is provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
      }
      user.password = req.body.password;
    }

    // Check if profile picture file was uploaded
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, 'profile_pictures');
        user.profilePic = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary Upload Error:', uploadError);
        res.status(500);
        throw new Error('Failed to upload profile picture to Cloudinary');
      }
    }

    // If username is changing, verify it is not already taken
    if (req.body.username && req.body.username !== req.user.username) {
      const usernameExists = await User.findOne({ username: req.body.username });
      if (usernameExists) {
        res.status(400);
        throw new Error('Username is already taken');
      }
    }

    // If email is changing, verify it is not already taken
    if (req.body.email && req.body.email !== req.user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already in use');
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      profilePic: updatedUser.profilePic,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow a user
// @route   POST /api/users/follow/:id
// @access  Protected
export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      res.status(404);
      throw new Error('User to follow not found');
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      res.status(400);
      throw new Error('You cannot follow yourself');
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      res.status(400);
      throw new Error('You are already following this user');
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/unfollow/:id
// @access  Protected
export const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      res.status(404);
      throw new Error('User to unfollow not found');
    }

    // Check if not following
    if (!currentUser.following.includes(userToUnfollow._id)) {
      res.status(400);
      throw new Error('You are not following this user');
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'User unfollowed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Search users by username
// @route   GET /api/users/search
// @access  Protected
export const searchUsers = async (req, res, next) => {
  const query = req.query.query;
  try {
    if (!query) {
      return res.json([]);
    }
    // Limit search to 15 results, case-insensitive partial match
    const users = await User.find({
      username: { $regex: query, $options: 'i' },
      _id: { $ne: req.user._id }, // Exclude current user from search list (optional)
    })
      .select('username profilePic bio followers')
      .limit(15);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended/suggested users to follow
// @route   GET /api/users/suggestions
// @access  Protected
export const getSuggestedUsers = async (req, res, next) => {
  try {
    // Get users that current user is NOT following already, and is not themselves
    const currentUser = await User.findById(req.user._id);
    const excludeIds = [...currentUser.following, currentUser._id];

    const suggestions = await User.find({
      _id: { $nin: excludeIds },
    })
      .select('username profilePic bio')
      .limit(5);

    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};
