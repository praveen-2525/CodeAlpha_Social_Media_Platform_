import express from 'express';
import {
  addComment,
  getPostComments,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:postId')
  .post(protect, addComment)
  .get(protect, getPostComments);
router.delete('/:id', protect, deleteComment);

export default router;
