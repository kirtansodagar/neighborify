import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createComment, getPostComments, getForumComments, deleteComment } from '../controllers/comment.controller.js';
import { validateObjectId } from '../middleware/validate.js';

const router = Router();

router.get('/post/:postId', validateObjectId('postId'), getPostComments);
router.get('/forum/:forumId', validateObjectId('forumId'), getForumComments);
router.post('/post/:postId', validateObjectId('postId'), protect, createComment);
router.post('/forum/:forumId', validateObjectId('forumId'), protect, createComment);
router.delete('/:id', validateObjectId('id'), protect, deleteComment);

export default router;
