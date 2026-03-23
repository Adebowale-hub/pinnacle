import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import api from '../../lib/api';
import './AdminOrders.css';

interface Order {
    _id: string;
    user: {
        name: string;
        email: string;
        phone: string;
    };
    items: Array<{
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
    };
    createdAt: string;
}

const AdminOrders = () => {
    const navigate = useNavigate();
    const { admin } = useAdminStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        fetchOrders();
    }, [admin, navigate, filter]);

    const fetchOrders = async () => {
        try {
            let url = '/admin/orders';
            if (filter !== 'all') {
                url += `?status=${filter}`;
            }
            const response = await api.get(url);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { orderStatus: newStatus });
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Failed to update order status');
        }
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="admin-orders">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <div className="container">
                <div className="orders-header">
                    <h1>Order Management</h1>
                    <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">
                        Back to Dashboard
                    </button>
                </div>

                <div className="filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-btn ${filter === 'processing' ? 'active' : ''}`}
                        onClick={() => setFilter('processing')}
                    >
                        Processing
                    </button>
                    <button
                        className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
                        onClick={() => setFilter('delivered')}
                    >
                        Delivered
                    </button>
                </div>

                <div className="orders-list">
                    {orders.length === 0 ? (
                        <div className="card empty-state">
                            <p>No orders found</p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order._id} className="card order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>Order #{order._id.slice(-8)}</h3>
                                        <p className="order-date">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <div className="order-badges">
                                        <span className={`badge ${order.orderStatus}`}>
                                            {order.orderStatus}
                                        </span>
                                        <span className={`badge ${order.paymentStatus}`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>

                                <div className="customer-info">
                                    <h4>Customer Details</h4>
                                    <p><strong>Name:</strong> {order.user.name}</p>
                                    <p><strong>Email:</strong> {order.user.email}</p>
                                    <p><strong>Phone:</strong> {order.user.phone}</p>
                                </div>

                                {order.deliveryAddress && (
                                    <div className="delivery-info">
                                        <h4>Delivery Address</h4>
                                        <p>
                                            {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state}
                                        </p>
                                    </div>
                                )}

                                <div className="order-items">
                                    <h4>Items</h4>
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <span>{item.name} x{item.quantity}</span>
                                            <span>{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <strong>Total: {formatCurrency(order.totalAmount)}</strong>
                                    </div>
                                    <div className="order-actions">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                            className="status-select"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
