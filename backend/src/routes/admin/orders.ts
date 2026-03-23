import express from 'express';
import {
    getAllOrders,
    updateOrderStatus
} from '../../controllers/orderController';
import { protectAdmin } from '../../middleware/auth';

const router = express.Router();

router.use(protectAdmin);

router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);

export default router;
