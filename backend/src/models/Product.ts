import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    category: 'Cosmetics' | 'Foodstuff' | 'Beverages' | 'Household Items';
    retailPrice: number;
    wholesalePrice: number;
    stock: number;
    images: string[];
    isAvailable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Please provide product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide product description'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: ['Cosmetics', 'Foodstuff', 'Beverages', 'Household Items']
    },
    retailPrice: {
        type: Number,
        required: [true, 'Please provide retail price'],
        min: 0
    },
    wholesalePrice: {
        type: Number,
        required: [true, 'Please provide wholesale price'],
        min: 0
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: 0,
        default: 0
    },
    images: {
        type: [String],
        default: []
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model<IProduct>('Product', productSchema);
