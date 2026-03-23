import './Shop.css';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        fetchProducts();
    }, [category, sort]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (category !== 'all') params.category = category;
            if (search) params.search = search;
            params.sort = sort;

            const response = await api.get('/products', { params });
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const categories = [
        { value: 'all', label: 'All Products' },
        { value: 'Cosmetics', label: 'Cosmetics' },
        { value: 'Foodstuff', label: 'Foodstuff' },
        { value: 'Beverages', label: 'Beverages' },
        { value: 'Household Items', label: 'Household Items' }
    ];

    return (
        <div className="shop">
            <div className="container">
                <h1>Shop All Products</h1>

                {/* Filters */}
                <div className="shop-filters card">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    <div className="filter-group">
                        <label className="form-label">Category:</label>
                        <div className="category-buttons">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    className={`btn ${category === cat.value ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setCategory(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="form-label">Sort By:</label>
                        <select
                            className="form-select"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : products.length > 0 ? (
                    <>
                        <p className="products-count">{products.length} products found</p>
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="no-products card">
                        <h3>No products found</h3>
                        <p>Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shop;
