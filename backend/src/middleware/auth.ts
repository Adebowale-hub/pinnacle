import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import Admin, { IAdmin } from '../models/Admin';

export interface AuthRequest extends Request {
    user?: IUser;
    admin?: IAdmin;
}

// Protect user routes
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Protect admin routes
export const protectAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                return res.status(401).json({ message: 'Admin not found' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Restrict to super admin only
export const restrictToSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.admin && req.admin.role === 'super_admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
};

// Generate JWT token
export const generateToken = (id: string): string => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET as string,
        { expiresIn: '30d' }
    );
};
