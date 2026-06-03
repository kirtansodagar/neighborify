import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createComment, getPostComments, getForumComments, deleteComment } from '../controllers/comment.controller.js';

const router = Router();

router.get('/post/:postId', getPostComments);
router.get('/forum/:forumId', getForumComments);
router.post('/post/:postId', protect, createComment);
router.post('/forum/:forumId', protect, createComment);
router.delete('/:id', protect, deleteComment);

export default router;
