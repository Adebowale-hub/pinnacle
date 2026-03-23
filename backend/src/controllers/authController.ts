import { Response } from 'express';
import User from '../models/User';
import { AuthRequest, generateToken } from '../middleware/auth';

// Register user
export const register = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            address
        });

        const token = generateToken(user._id.toString());

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Login user
export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id.toString());

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        res.json({
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
            address: user?.address
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        if (req.body.address) {
            user.address = { ...user.address, ...req.body.address };
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            address: updatedUser.address
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
