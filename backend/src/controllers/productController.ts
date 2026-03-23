import { Response } from 'express';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import { uploadImage } from '../config/cloudinary';

// Get all products with filters
export const getProducts = async (req: AuthRequest, res: Response) => {
    try {
        const { category, search, sort, page = 1, limit = 12 } = req.query;

        let query: any = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Only show available products for users
        query.isAvailable = true;

        // Sort options
        let sortOption: any = {};
        if (sort === 'price-asc') sortOption.retailPrice = 1;
        else if (sort === 'price-desc') sortOption.retailPrice = -1;
        else if (sort === 'name') sortOption.name = 1;
        else sortOption.createdAt = -1; // newest first by default

        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(query)
            .sort(sortOption)
            .limit(limitNum)
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            total
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get single product
export const getProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get products by category
export const getProductsByCategory = async (req: AuthRequest, res: Response) => {
    try {
        const products = await Product.find({
            category: req.params.category,
            isAvailable: true
        });

        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get all products (including unavailable)
export const getAllProductsAdmin = async (req: AuthRequest, res: Response) => {
    try {
        const { category, search, sort } = req.query;

        let query: any = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortOption: any = {};
        if (sort === 'price-asc') sortOption.retailPrice = 1;
        else if (sort === 'price-desc') sortOption.retailPrice = -1;
        else if (sort === 'name') sortOption.name = 1;
        else sortOption.createdAt = -1;

        const products = await Product.find(query).sort(sortOption);

        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Create product
export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update product
export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete product
export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Upload product image
export const uploadProductImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = await uploadImage(req.file);

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.images.push(imageUrl);
        await product.save();

        res.json({ imageUrl, product });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
