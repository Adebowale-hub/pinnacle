import './Cart.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const Cart = () => {
    const navigate = useNavigate();
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
    const user = useAuthStore((state) => state.user);

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="cart-empty">
                <div className="container">
                    <div className="empty-card card">
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Shopping Cart</h1>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.product._id} className="cart-item card">
                                <img
                                    src={item.product.images[0] || '/placeholder.jpg'}
                                    alt={item.product.name}
                                    className="item-image"
                                />

                                <div className="item-info">
                                    <h3>{item.product.name}</h3>
                                    <p className="item-category">{item.product.category}</p>
                                    <p className="item-price">₦{item.product.retailPrice.toLocaleString()}</p>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                        disabled={item.quantity >= item.product.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    <p className="total-label">Total:</p>
                                    <p className="total-value">
                                        ₦{(item.product.retailPrice * item.quantity).toLocaleString()}
                                    </p>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item.product._id)}
                                    title="Remove item"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card">
                        <h3>Order Summary</h3>

                        <div className="summary-row">
                            <span>Subtotal ({items.length} items)</span>
                            <span>₦{getTotalPrice().toLocaleString()}</span>
                        </div>

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>₦{getTotalPrice().toLocaleString()}</span>
                        </div>

                        <button
                            className="btn btn-primary btn-lg btn-block"
                            onClick={handleCheckout}
                        >
                            Proceed to Checkout
                        </button>

                        <button
                            className="btn btn-secondary btn-block mt-4"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>

                        <Link to="/shop" className="continue-shopping">
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
