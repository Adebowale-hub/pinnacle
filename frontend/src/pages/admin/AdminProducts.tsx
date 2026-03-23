import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';
import api from '../../lib/api';
import './AdminProducts.css';

interface Product {
    _id: string;
    name: string;
    description: string;
    category: string;
    retailPrice: number;
    wholesalePrice: number;
    stock: number;
    images: string[];
    isAvailable: boolean;
}

const AdminProducts = () => {
    const navigate = useNavigate();
    const { admin } = useAdminStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Foodstuff',
        retailPrice: '',
        wholesalePrice: '',
        stock: '',
        images: [''],
        isAvailable: true
    });

    useEffect(() => {
        if (!admin) {
            navigate('/admin/login');
            return;
        }
        fetchProducts();
    }, [admin, navigate]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/admin/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/admin/products/${editingProduct._id}`, formData);
            } else {
                await api.post('/admin/products', formData);
            }
            setShowModal(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/admin/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            retailPrice: product.retailPrice.toString(),
            wholesalePrice: product.wholesalePrice.toString(),
            stock: product.stock.toString(),
            images: product.images.length > 0 ? product.images : [''],
            isAvailable: product.isAvailable
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            category: 'Foodstuff',
            retailPrice: '',
            wholesalePrice: '',
            stock: '',
            images: [''],
            isAvailable: true
        });
    };

    const addImageField = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImageField = (index: number) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
    };

    const updateImageField = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData({ ...formData, images: newImages });
    };

    const formatCurrency = (amount: number) => {
        return `₦${amount.toLocaleString()}`;
    };

    if (loading) {
        return (
            <div className="admin-products">
                <div className="container">
                    <div className="loading">Loading...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <div className="container">
                <div className="products-header">
                    <h1>Product Management</h1>
                    <div className="header-actions">
                        <button onClick={() => navigate('/admin/dashboard')} className="btn btn-secondary">
                            Back to Dashboard
                        </button>
                        <button onClick={() => { resetForm(); setShowModal(true); }} className="btn btn-primary">
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product._id} className="product-card card">
                            <div className="product-status">
                                {product.isAvailable ? (
                                    <span className="badge available">Available</span>
                                ) : (
                                    <span className="badge unavailable">Unavailable</span>
                                )}
                                {product.stock < 10 && (
                                    <span className="badge low-stock">Low Stock</span>
                                )}
                            </div>

                            <h3>{product.name}</h3>
                            <p className="category">{product.category}</p>
                            <p className="description">{product.description}</p>

                            <div className="product-pricing">
                                <div className="price-item">
                                    <span className="price-label">Retail:</span>
                                    <span className="price-value">{formatCurrency(product.retailPrice)}</span>
                                </div>
                                <div className="price-item">
                                    <span className="price-label">Wholesale:</span>
                                    <span className="price-value">{formatCurrency(product.wholesalePrice)}</span>
                                </div>
                            </div>

                            <div className="product-stock">
                                <span className="stock-label">Stock:</span>
                                <span className={`stock-value ${product.stock < 10 ? 'low' : ''}`}>
                                    {product.stock} units
                                </span>
                            </div>

                            <div className="product-actions">
                                <button onClick={() => handleEdit(product)} className="btn btn-sm btn-outline">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(product._id)} className="btn btn-sm btn-danger">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                                <button onClick={() => setShowModal(false)} className="close-btn">&times;</button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-input"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Foodstuff">Foodstuff</option>
                                        <option value="Beverages">Beverages</option>
                                        <option value="Cosmetics">Cosmetics</option>
                                        <option value="Household Items">Household Items</option>
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Retail Price (₦)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.retailPrice}
                                            onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Wholesale Price (₦)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={formData.wholesalePrice}
                                            onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Stock</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Product Images (URLs)</label>
                                    {formData.images.map((image, index) => (
                                        <div key={index} className="image-input-group">
                                            <input
                                                type="url"
                                                className="form-input"
                                                value={image}
                                                onChange={(e) => updateImageField(index, e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                            {formData.images.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageField(index)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addImageField}
                                        className="btn btn-sm btn-outline"
                                        style={{ marginTop: 'var(--space-2)' }}
                                    >
                                        + Add Another Image
                                    </button>
                                </div>

                                <div className="form-group checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.isAvailable}
                                            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                                        />
                                        <span>Product is available for sale</span>
                                    </label>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProduct ? 'Update Product' : 'Create Product'}
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

export default AdminProducts;
