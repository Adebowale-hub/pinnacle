import { Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';
import './AdminNavbar.css';

const AdminNavbar = () => {
    const { admin, logout } = useAdminStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <nav className="admin-navbar">
            <div className="container">
                <div className="admin-navbar-content">
                    <Link to="/admin/dashboard" className="admin-logo">
                        <span className="logo-pinnacle">PINNACLE</span>
                        <span className="logo-supermarket">Admin Panel</span>
                    </Link>

                    {admin && (
                        <div className="admin-nav-items">
                            <Link to="/admin/dashboard" className="admin-nav-link">
                                Dashboard
                            </Link>
                            <Link to="/admin/products" className="admin-nav-link">
                                Products
                            </Link>
                            <Link to="/admin/orders" className="admin-nav-link">
                                Orders
                            </Link>
                            {admin.role === 'super_admin' && (
                                <Link to="/admin/admins" className="admin-nav-link">
                                    Admins
                                </Link>
                            )}
                            <div className="admin-user-info">
                                <span className="admin-name">{admin.name}</span>
                                <button onClick={handleLogout} className="btn btn-sm btn-secondary">
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
