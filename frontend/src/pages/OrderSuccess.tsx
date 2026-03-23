import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import api from '../lib/api';
import './OrderSuccess.css';

const OrderSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCartStore();
    const [verifying, setVerifying] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const reference = searchParams.get('reference');

        if (!reference) {
            setError('No payment reference found');
            setVerifying(false);
            return;
        }

        verifyPayment(reference);
    }, [searchParams]);

    const verifyPayment = async (reference: string) => {
        try {
            const response = await api.get(`/orders/verify/${reference}`);

            if (response.data.success) {
                setOrder(response.data.order);
                clearCart(); // Clear the cart after successful payment
            } else {
                setError('Payment verification failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment verification failed');
        } finally {
            setVerifying(false);
        }
    };

    if (verifying) {
        return (
            <div className="order-success-page">
                <div className="container">
                    <div className="card success-card">
                        <div className="verifying">
                            <div className="spinner"></div>
                            <h2>Verifying your payment...</h2>
                            <p>Please wait while we confirm your payment</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-success-page">
                <div className="container">
                    <div className="card error-card">
                        <div className="error-icon">❌</div>
                        <h2>Payment Failed</h2>
                        <p>{error}</p>
                        <button onClick={() => navigate('/cart')} className="btn btn-primary">
                            Return to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-success-page">
            <div className="container">
                <div className="card success-card">
                    <div className="success-icon">✅</div>
                    <h1>Order Placed Successfully!</h1>
                    <p className="success-message">
                        Thank you for your order. Your payment has been confirmed.
                    </p>

                    <div className="order-details">
                        <h3>Order Details</h3>
                        <div className="detail-row">
                            <span>Order ID:</span>
                            <span className="detail-value">#{order?._id.slice(-8)}</span>
                        </div>
                        <div className="detail-row">
                            <span>Total Amount:</span>
                            <span className="detail-value">₦{order?.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="detail-row">
                            <span>Payment Status:</span>
                            <span className="badge-paid">Paid</span>
                        </div>
                        <div className="detail-row">
                            <span>Order Status:</span>
                            <span className="badge-processing">Processing</span>
                        </div>
                        {order?.deliveryOption === 'delivery' && order?.deliveryAddress && (
                            <div className="detail-row">
                                <span>Delivery Address:</span>
                                <span className="detail-value">
                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                                </span>
                            </div>
                        )}
                        {order?.deliveryOption === 'pickup' && (
                            <div className="detail-row">
                                <span>Pickup Location:</span>
                                <span className="detail-value">Pinnacle Supermarket, Dugbe, Ibadan</span>
                            </div>
                        )}
                    </div>

                    <div className="order-items">
                        <h3>Items Ordered</h3>
                        {order?.items.map((item: any, index: number) => (
                            <div key={index} className="order-item">
                                <span className="item-name">{item.name}</span>
                                <span className="item-quantity">x{item.quantity}</span>
                                <span className="item-price">₦{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>

                    <div className="success-actions">
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
                            View Order in Dashboard
                        </button>
                        <button onClick={() => navigate('/shop')} className="btn btn-secondary">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
