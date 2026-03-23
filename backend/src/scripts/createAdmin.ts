import dotenv from 'dotenv';
import connectDB from '../config/database';
import Admin from '../models/Admin';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@pinnacle.com' });

        if (existingAdmin) {
            console.log('❌ Admin user already exists!');
            console.log('Email: admin@pinnacle.com');
            process.exit(0);
        }

        // Create super admin
        const admin = await Admin.create({
            name: 'Super Admin',
            email: 'admin@pinnacle.com',
            password: 'admin123',
            role: 'super_admin'
        });

        console.log('✅ Super Admin created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Login Credentials:');
        console.log('Email: admin@pinnacle.com');
        console.log('Password: admin123');
        console.log('Role: super_admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error: any) {
        console.error('Error creating admin:', error.message);
        process.exit(1);
    }
};

createAdmin();
