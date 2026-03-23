import express from 'express';
import { loginAdmin, getAdminMe } from '../../controllers/adminAuthController';
import { protectAdmin } from '../../middleware/auth';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getAdminMe);

export default router;
