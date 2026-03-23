import './Home.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                const response = await api.get('/products?limit=8');
                setFeaturedProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const categories = [
        { name: 'Cosmetics', icon: '💄', color: '#EC4899' },
        { name: 'Foodstuff', icon: '🍚', color: '#10B981' },
        { name: 'Beverages', icon: '🥤', color: '#3B82F6' },
        { name: 'Household Items', icon: '🧹', color: '#F59E0B' }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <div className="hero-content fade-in">
                        <h1>Welcome to Pinnacle Supermarket</h1>
                        <p className="hero-subtitle">Your trusted one-stop shop for all household needs in Ibadan</p>
                        <p className="hero-description">
                            Quality products at affordable and wholesale prices. From cosmetics to foodstuff,
                            beverages to household items – we've got you covered!
                        </p>
                        <div className="hero-buttons">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Shop Now
                            </Link>
                            <Link to="/about" className="btn btn-outline btn-lg">
                                Learn More
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="categories-section">
                <div className="container">
                    <h2 className="text-center">Shop by Category</h2>
                    <div className="categories-grid">
                        {categories.map((category) => (
                            <Link
                                key={category.name}
                                to={`/shop?category=${category.name}`}
                                className="category-card card hover-lift"
                                style={{ borderTop: `4px solid ${category.color}` }}
                            >
                                <div className="category-icon">{category.icon}</div>
                                <h3>{category.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section">
                <div className="container">
                    <h2 className="text-center">Featured Products</h2>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {featuredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-8">
                        <Link to="/shop" className="btn btn-primary btn-lg">
                            View All Products
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-section">
                <div className="container">
                    <h2 className="text-center">Why Choose Pinnacle?</h2>
                    <div className="why-grid">
                        <div className="why-card card">
                            <div className="why-icon">💰</div>
                            <h3>Affordable Prices</h3>
                            <p>Competitive retail and wholesale pricing that saves you money</p>
                        </div>
                        <div className="why-card card">
                            <div className="why-icon">✨</div>
                            <h3>Quality Products</h3>
                            <p>Only the best products for your home and family</p>
                        </div>
                        <div className="why-card card">
                            <div className="why-icon">🚗</div>
                            <h3>Spacious Parking</h3>
                            <p>Ample parking space for your convenience</p>
                        </div>
                        <div className="why-card card">
                            <div className="why-icon">🏪</div>
                            <h3>Clean Environment</h3>
                            <p>Well organized and maintained shopping space</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="location-section">
                <div className="container">
                    <h2 className="text-center">Visit Us Today</h2>
                    <div className="location-info card">
                        <div>
                            <h3>📍 Our Location</h3>
                            <p>28 Adekunle Fajuyi Road, Dugbe, Ibadan</p>
                            <p>(Adjacent to a filling station)</p>
                            <br />
                            <h3>📞 Contact</h3>
                            <p>Phone: 0809 412 3400</p>
                            <br />
                            <h3>⏰ Opening Hours</h3>
                            <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                            <p>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
