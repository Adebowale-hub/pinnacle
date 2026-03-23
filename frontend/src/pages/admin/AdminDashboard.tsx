import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import api from '../../lib/api';
import './AdminDashboard.css';

interface DashboardStats {
    totalProducts: number;
    totalOrders: number;
    paidOrders: number;
    totalRevenue: number;
    lowStockProducts: any[];
    recentOrders: any[];
}

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { admin, logout } = useAdminStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        fetchStats();
    }, [admin, navigate]);

    const fetchStats = async () => {
        try {
            const response = await api.get('/admin/dashboard/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p className="admin-subtitle">Welcome back, {admin?.name}</p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Logout
                    </button>
                </div>

                <div className="stats-overview">
                    <div className="stat-card">
                        <div className="stat-icon products">📦</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats?.totalProducts || 0}</div>
                            <div className="stat-label">Total Products</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orders">🛒</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats?.totalOrders || 0}</div>
                            <div className="stat-label">Total Orders</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon paid">✅</div>
                        <div className="stat-content">
                            <div className="stat-value">{stats?.paidOrders || 0}</div>
                            <div className="stat-label">Paid Orders</div>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon revenue">💰</div>
                        <div className="stat-content">
                            <div className="stat-value">{formatCurrency(stats?.totalRevenue || 0)}</div>
                            <div className="stat-label">Total Revenue</div>
                        </div>
                    </div>
                </div>

                <div className="dashboard-grid">
                    <div className="card">
                        <h2>Recent Orders</h2>
                        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                            <div className="recent-orders-list">
                                {stats.recentOrders.map((order: any) => (
                                    <div key={order._id} className="recent-order-item">
                                        <div className="order-info">
                                            <span className="order-id">#{order._id.slice(-8)}</span>
                                            <span className="order-customer">{order.user?.name || 'Guest'}</span>
                                        </div>
                                        <div className="order-details">
                                            <span className="order-amount">{formatCurrency(order.totalAmount)}</span>
                                            <span className={`order-status ${order.orderStatus}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">No recent orders</p>
                        )}
                        <button
                            onClick={() => navigate('/admin/orders')}
                            className="btn btn-outline btn-block"
                        >
                            View All Orders
                        </button>
                    </div>

                    <div className="card">
                        <h2>Low Stock Alert</h2>
                        {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                            <div className="low-stock-list">
                                {stats.lowStockProducts.map((product: any) => (
                                    <div key={product._id} className="low-stock-item">
                                        <div className="product-info">
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-category">{product.category}</span>
                                        </div>
                                        <div className="stock-badge warning">
                                            {product.stock} left
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">All products are well stocked</p>
                        )}
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="btn btn-outline btn-block"
                        >
                            Manage Products
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
