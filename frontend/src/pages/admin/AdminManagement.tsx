import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import api from '../../lib/api';
import './AdminManagement.css';

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin';
    createdAt: string;
}

const AdminManagement = () => {
    const navigate = useNavigate();
    const { admin } = useAdminStore();
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin' as 'admin' | 'super_admin'
    });

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }

        // Only super admin can access this page
        if (admin.role !== 'super_admin') {
            navigate('/admin/dashboard');
            return;
        }

        fetchAdmins();
    }, [admin, navigate]);

    const fetchAdmins = async () => {
        try {
            const response = await api.get('/admin/admins');
            setAdmins(response.data);
        } catch (error) {
            console.error('Error fetching admins:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/admins', formData);
            setShowModal(false);
            resetForm();
            fetchAdmins();
            alert('Admin created successfully!');
        } catch (error: any) {
            console.error('Error creating admin:', error);
            alert(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const handleDelete = async (id: string, adminName: string, adminRole: string) => {
        if (adminRole === 'super_admin') {
            alert('Cannot delete super admin!');
            return;
        }

        if (!confirm(`Are you sure you want to remove ${adminName}? They will no longer be able to log in to the admin panel.`)) {
            return;
        }

        try {
            await api.delete(`/admin/admins/${id}`);
            fetchAdmins();
            alert('Admin removed successfully!');
        } catch (error: any) {
            console.error('Error deleting admin:', error);
            alert(error.response?.data?.message || 'Failed to remove admin');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'admin'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-management">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-management">
            <div className="container">
                <div className="management-header">
                    <h1>Admin Management</h1>
                    <div className="header-actions">
                        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">
                            Back to Dashboard
                        </button>
                        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
                            Add New Admin
                        </button>
                    </div>
                </div>

                <div className="admins-list">
                    <div className="card">
                        <table className="admins-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map((adminUser) => (
                                    <tr key={adminUser._id}>
                                        <td>
                                            <div className="admin-name">
                                                {adminUser.name}
                                                {adminUser._id === admin?._id && (
                                                    <span className="you-badge">You</span>
                                                )}
                                            </div>
                                        </td>
                                        <td>{adminUser.email}</td>
                                        <td>
                                            <span className={`role-badge ${adminUser.role}`}>
                                                {adminUser.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                            </span>
                                        </td>
                                        <td>{formatDate(adminUser.createdAt)}</td>
                                        <td>
                                            {adminUser.role !== 'super_admin' ? (
                                                <button
                                                    onClick={() => handleDelete(adminUser._id, adminUser.name, adminUser.role)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Remove
                                                </button>
                                            ) : (
                                                <span className="protected-text">Protected</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {admins.length === 0 && (
                            <div className="empty-state">
                                <p>No admins found</p>
                            </div>
                        )}
                    </div>
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Admin</h2>
                                <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        minLength={6}
                                        placeholder="Minimum 6 characters"
                                    />
                                    <small className="form-hint">You are setting this admin's password</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-input"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'super_admin' })}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="super_admin">Super Admin</option>
                                    </select>
                                    <small className="form-hint">Super Admins can manage other admins</small>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Create Admin
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminManagement;
