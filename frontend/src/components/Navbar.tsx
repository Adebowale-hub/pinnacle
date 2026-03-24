import './Navbar.css';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar = () => {
    const { user, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-pinnacle">PINNACLE</span>
                        <span className="logo-supermarket">Supermarket</span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/">Home</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/about">About</Link>
                        <Link to="/contact">Contact</Link>
                    </div>

                    <div className="navbar-actions">
                        <Link to="/cart" className="cart-button">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>

                        {user ? (
                            <div className="user-menu">
                                <Link to="/dashboard" className="btn btn-sm btn-outline">Dashboard</Link>
                                <button onClick={logout} className="btn btn-sm btn-secondary">Logout</button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn btn-sm btn-primary">Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
