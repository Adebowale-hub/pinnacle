import { Response } from 'express';
import Admin from '../models/Admin';
import { AuthRequest, generateToken } from '../middleware/auth';

// Admin login
export const loginAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(admin._id.toString());

        res.json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get current admin
export const getAdminMe = async (req: AuthRequest, res: Response) => {
    try {
        const admin = req.admin;
        res.json({
            _id: admin?._id,
            name: admin?.name,
            email: admin?.email,
            role: admin?.role
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get all admins (Super Admin only)
export const getAllAdmins = async (req: AuthRequest, res: Response) => {
    try {
        const admins = await Admin.find().select('-password');
        res.json(admins);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create admin (Super Admin only)
export const createAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const admin = await Admin.create({
            name,
            email,
            password,
            role: role || 'admin'
        });

        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Delete admin (Super Admin only)
export const deleteAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const admin = await Admin.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Prevent deleting super admin
        if (admin.role === 'super_admin') {
            return res.status(403).json({ message: 'Cannot delete super admin' });
        }

        await Admin.findByIdAndDelete(req.params.id);
        res.json({ message: 'Admin removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
