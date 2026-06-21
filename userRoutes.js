import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  searchUsers,
  getSuggestedUsers,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/suggestions', protect, getSuggestedUsers);
router.get('/profile/:username', protect, getUserProfile);
router.put('/profile', protect, upload.single('profilePic'), updateUserProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

export default router;
