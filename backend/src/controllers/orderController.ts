import { Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { initializePayment, verifyPayment } from '../utils/paystack';

// Create order and initialize payment
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items, deliveryOption, deliveryAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // Calculate total and verify stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.retailPrice,
                quantity: item.quantity
            });

            totalAmount += product.retailPrice * item.quantity;
        }

        // Create order
        const order = await Order.create({
            user: req.user?._id,
            items: orderItems,
            totalAmount,
            deliveryOption,
            deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress : undefined
        });

        // Initialize Paystack payment
        const paymentData = await initializePayment(
            req.user?.email as string,
            totalAmount,
            order._id.toString()
        );

        // Update order with payment reference
        order.paystackReference = paymentData.data.reference;
        await order.save();

        res.status(201).json({
            order,
            paymentUrl: paymentData.data.authorization_url,
            reference: paymentData.data.reference
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Verify payment
export const verifyOrderPayment = async (req: AuthRequest, res: Response) => {
    try {
        const { reference } = req.params;

        // Verify with Paystack
        const paymentData = await verifyPayment(reference);

        if (paymentData.data.status === 'success') {
            // Find order and update
            const order = await Order.findOne({ paystackReference: reference });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            order.paymentStatus = 'paid';
            order.orderStatus = 'processing';
            await order.save();

            // Reduce stock for each product
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }

            res.json({
                success: true,
                message: 'Payment verified successfully',
                order
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Payment verification failed'
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get user orders
export const getUserOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user?._id })
            .populate('items.product', 'name images')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get single order
export const getOrder = async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order
        if (order.user._id.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const { status, paymentStatus } = req.query;

        let query: any = {};

        if (status) query.orderStatus = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const orders = await Order.find(query)
            .populate('items.product', 'name images')
            .populate('user', 'name email phone')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { orderStatus },
            { new: true }
        ).populate('items.product', 'name images')
            .populate('user', 'name email phone');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get dashboard stats
export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const paidOrders = await Order.countDocuments({ paymentStatus: 'paid' });

        const revenue = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const lowStockProducts = await Product.find({ stock: { $lt: 10 } }).limit(5);

        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalProducts,
            totalOrders,
            paidOrders,
            totalRevenue: revenue[0]?.total || 0,
            lowStockProducts,
            recentOrders
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
