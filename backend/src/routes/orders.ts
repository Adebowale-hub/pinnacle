import express from 'express';
import {
    createOrder,
    verifyOrderPayment,
    getUserOrders,
    getOrder
} from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/verify/:reference', protect, verifyOrderPayment);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

export default router;
