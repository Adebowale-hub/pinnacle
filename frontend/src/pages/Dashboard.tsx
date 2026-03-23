import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../lib/api';
import './Dashboard.css';

interface Order {
    _id: string;
    items: Array<{
        product: {
            name: string;
            images: string[];
        };
        name: string;
        price: number;
        quantity: number;
    }>;
    totalAmount: number;
    orderStatus: string;
    paymentStatus: string;
    deliveryOption: string;
    deliveryAddress?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
    createdAt: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header">
                    <h1>My Dashboard</h1>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Logout
                    </button>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders ({orders.length})
                    </button>
                </div>

                {activeTab === 'profile' && (
                    <div className="dashboard-content">
                        <div className="card profile-card">
                            <h2>Profile Information</h2>
                            <div className="profile-info">
                                <div className="info-row">
                                    <span className="label">Name:</span>
                                    <span className="value">{user?.name}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Email:</span>
                                    <span className="value">{user?.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Phone:</span>
                                    <span className="value">{user?.phone || 'Not provided'}</span>
                                </div>
                                {user?.address && (
                                    <div className="info-row">
                                        <span className="label">Address:</span>
                                        <span className="value">
                                            {user.address.street}, {user.address.city}, {user.address.state} {user.address.zipCode}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="dashboard-content">
                        {orders.length === 0 ? (
                            <div className="card empty-state">
                                <h3>No Orders Yet</h3>
                                <p>You haven't placed any orders yet. Start shopping!</p>
                                <button onClick={() => navigate('/shop')} className="btn btn-primary">
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {orders.map((order) => (
                                    <div key={order._id} className="card order-card">
                                        <div className="order-header">
                                            <div className="order-info">
                                                <h3>Order #{order._id.slice(-8)}</h3>
                                                <p className="order-date">{formatDate(order.createdAt)}</p>
                                            </div>
                                            <div className="order-status">
                                                <span className={`status-badge ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                                <span className={`status-badge ${order.paymentStatus === 'paid' ? 'status-paid' : 'status-unpaid'}`}>
                                                    {order.paymentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="order-items">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <div className="item-details">
                                                        <span className="item-name">{item.name}</span>
                                                        <span className="item-quantity">x{item.quantity}</span>
                                                    </div>
                                                    <span className="item-price">{formatCurrency(item.price * item.quantity)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-footer">
                                            <div className="delivery-info">
                                                <span className="delivery-type">
                                                    {order.deliveryOption === 'delivery' ? '🚚 Home Delivery' : '🏪 Pickup'}
                                                </span>
                                                {order.deliveryAddress && (
                                                    <span className="delivery-address">
                                                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="order-total">
                                                <strong>Total: {formatCurrency(order.totalAmount)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
