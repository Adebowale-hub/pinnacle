import mongoose, { Document, Schema } from 'mongoose';

interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: 'pending' | 'paid' | 'failed';
    orderStatus: 'pending' | 'processing' | 'delivered' | 'cancelled';
    paystackReference: string;
    deliveryOption: 'delivery' | 'pickup';
    deliveryAddress?: {
        street: string;
        city: string;
        state: string;
        phone: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paystackReference: {
        type: String,
        default: ''
    },
    deliveryOption: {
        type: String,
        enum: ['delivery', 'pickup'],
        required: true
    },
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        phone: String
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

orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export default mongoose.model<IOrder>('Order', orderSchema);
