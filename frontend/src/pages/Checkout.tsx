import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, getTotalPrice } = useCartStore();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState<'pickup' | 'delivery'>('pickup');
    const [deliveryAddress, setDeliveryAddress] = useState({
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        state: user?.address?.state || '',
        phone: user?.phone || ''
    });

    // Redirect if not logged in or cart is empty
    if (!user) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const totalAmount = getTotalPrice();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            // Prepare order data
            const orderItems = items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }));

            const orderData = {
                items: orderItems,
                deliveryOption,
                deliveryAddress: deliveryOption === 'delivery' ? deliveryAddress : undefined
            };

            // Create order and get Paystack payment URL
            const response = await api.post('/orders', orderData);
            const { paymentUrl } = response.data;

            // Redirect to Paystack payment page
            window.location.href = paymentUrl;

        } catch (error: any) {
            console.error('Checkout error:', error);
            alert(error.response?.data?.message || 'Checkout failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Checkout</h1>

                <div className="checkout-content">
                    <div className="checkout-main">
                        {/* Delivery Option */}
                        <div className="card delivery-section">
                            <h2>Delivery Method</h2>
                            <div className="delivery-options">
                                <label className={`delivery-option ${deliveryOption === 'pickup' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="pickup"
                                        checked={deliveryOption === 'pickup'}
                                        onChange={() => setDeliveryOption('pickup')}
                                    />
                                    <div className="option-content">
                                        <div className="option-icon">🏪</div>
                                        <div className="option-details">
                                            <h3>Store Pickup</h3>
                                            <p>Pick up from our store in Dugbe, Ibadan</p>
                                            <span className="option-price">Free</span>
                                        </div>
                                    </div>
                                </label>

                                <label className={`delivery-option ${deliveryOption === 'delivery' ? 'active' : ''}`}>
                                    <input
                                        type="radio"
                                        name="delivery"
                                        value="delivery"
                                        checked={deliveryOption === 'delivery'}
                                        onChange={() => setDeliveryOption('delivery')}
                                    />
                                    <div className="option-content">
                                        <div className="option-icon">🚚</div>
                                        <div className="option-details">
                                            <h3>Home Delivery</h3>
                                            <p>Get it delivered to your doorstep</p>
                                            <span className="option-price">Free within Ibadan</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Delivery Address Form */}
                        {deliveryOption === 'delivery' && (
                            <div className="card address-section">
                                <h2>Delivery Address</h2>
                                <div className="form-group">
                                    <label className="form-label">Street Address</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={deliveryAddress.street}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={deliveryAddress.city}
                                            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={deliveryAddress.state}
                                            onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        value={deliveryAddress.phone}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="card items-section">
                            <h2>Order Items</h2>
                            <div className="checkout-items">
                                {items.map((item) => (
                                    <div key={item.product._id} className="checkout-item">
                                        <img
                                            src={item.product.images[0] || '/placeholder.jpg'}
                                            alt={item.product.name}
                                            className="checkout-item-image"
                                        />
                                        <div className="checkout-item-info">
                                            <h4>{item.product.name}</h4>
                                            <p>Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="checkout-item-price">
                                            ₦{(item.product.retailPrice * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="checkout-sidebar">
                        <div className="card summary-card">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal ({items.length} items)</span>
                                <span>₦{totalAmount.toLocaleString()}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>Free</span>
                            </div>

                            <div className="summary-divider"></div>

                            <div className="summary-row summary-total">
                                <span>Total</span>
                                <span>₦{totalAmount.toLocaleString()}</span>
                            </div>

                            <button
                                className="btn btn-primary btn-lg btn-block"
                                onClick={handleCheckout}
                                disabled={loading || (deliveryOption === 'delivery' && !deliveryAddress.street)}
                            >
                                {loading ? 'Processing...' : 'Pay with Paystack'}
                            </button>

                            <p className="payment-note">
                                🔒 Secure payment powered by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
