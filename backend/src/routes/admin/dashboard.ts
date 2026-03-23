import express from 'express';
import { getDashboardStats } from '../../controllers/orderController';
import { protectAdmin } from '../../middleware/auth';

const router = express.Router();

router.use(protectAdmin);

router.get('/stats', getDashboardStats);

export default router;
