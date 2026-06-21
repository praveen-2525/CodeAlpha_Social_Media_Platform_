import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Add comment to a post
// @route   POST /api/comments/:postId
// @access  Protected
export const addComment = async (req, res, next) => {
  const { text } = req.body;
  const postId = req.params.postId;

  try {
    if (!text) {
      res.status(400);
      throw new Error('Comment text is required');
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comment = await Comment.create({
      post: postId,
      user: req.user._id,
      text,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'username profilePic'
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Protected
export const getPostComments = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      res.status(404);
      throw new Error('Post not found');
    }

    const comments = await Comment.find({ post: postId })
      .populate('user', 'username profilePic')
      .sort({ createdAt: 1 }); // Oldest first (standard chat/comment flow)

    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Protected
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('post');

    if (!comment) {
      res.status(404);
      throw new Error('Comment not found');
    }

    // A comment can be deleted if the logged-in user is either:
    // 1. The author of the comment
    // 2. The owner of the post on which the comment was made
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();
    const isPostOwner = comment.post.user.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostOwner) {
      res.status(401);
      throw new Error('Not authorized to delete this comment');
    }

    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
