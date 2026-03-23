import './ProductCard.css';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = () => {
        addToCart(product);
    };

    return (
        <div className="product-card card hover-lift">
            <div className="product-image">
                <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    loading="lazy"
                />
                {product.stock < 10 && product.stock > 0 && (
                    <span className="badge badge-warning">Low Stock</span>
                )}
                {product.stock === 0 && (
                    <span className="badge badge-error">Out of Stock</span>
                )}
            </div>

            <div className="product-info">
                <span className="product-category">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description.substring(0, 80)}...</p>

                <div className="product-prices">
                    <div className="price-item">
                        <span className="price-label">Retail:</span>
                        <span className="price-value">₦{product.retailPrice.toLocaleString()}</span>
                    </div>
                    {product.wholesalePrice < product.retailPrice && (
                        <div className="price-item">
                            <span className="price-label">Wholesale:</span>
                            <span className="price-value price-wholesale">₦{product.wholesalePrice.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <button
                    className="btn btn-primary btn-block"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
