import './Footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Pinnacle Supermarket</h3>
                        <p>Your trusted one-stop shop for all household needs. Affordable and wholesale pricing in the heart of Ibadan.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <div className="footer-links">
                            <Link to="/shop">Shop Now</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/contact">Contact</Link>
                            <Link to="/admin/login">Admin Login</Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Contact Us</h4>
                        <div className="footer-contact">
                            <p>📍 28 Adekunle Fajuyi Road, Dugbe, Ibadan</p>
                            <p>📞 0809 412 3400</p>
                            <p>⏰ Mon - Sat: 8:00 AM - 8:00 PM</p>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Categories</h4>
                        <div className="footer-links">
                            <Link to="/shop?category=Cosmetics">Cosmetics</Link>
                            <Link to="/shop?category=Foodstuff">Foodstuff</Link>
                            <Link to="/shop?category=Beverages">Beverages</Link>
                            <Link to="/shop?category=Household Items">Household Items</Link>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Pinnacle Supermarket. All rights reserved.</p>
                    <p>Built with ❤️ for the people of Ibadan</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
