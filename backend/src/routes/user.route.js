import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getRecconectedUsers, getMyFriends } from '../controllers.js/user.controller.js';
const router = express.Router();
router.use(protectRoute);

router.get("/",getRecconectedUsers);
router.get("/friends",getMyFriends);


export default router;