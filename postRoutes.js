import express from 'express';
import {
  createPost,
  getFeed,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/feed', protect, getFeed);
router.get('/user/:username', protect, getUserPosts);
router.route('/:id')
  .put(protect, updatePost)
  .delete(protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/unlike', protect, unlikePost);

export default router;
