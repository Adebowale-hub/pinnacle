import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

export interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        reference: string;
        amount: number;
        status: string;
        paid_at: string;
        metadata: any;
    };
}

// Initialize payment
export const initializePayment = async (
    email: string,
    amount: number,
    orderId: string
): Promise<PaystackInitializeResponse> => {
    try {
        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: amount * 100, // Convert to kobo
                metadata: {
                    orderId
                },
                callback_url: `${process.env.FRONTEND_URL}/payment/verify`
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Payment initialization failed');
    }
};

// Verify payment
export const verifyPayment = async (reference: string): Promise<PaystackVerifyResponse> => {
    try {
        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Payment verification failed');
    }
};
