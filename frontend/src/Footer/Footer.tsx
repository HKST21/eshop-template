import { Link } from 'react-router-dom';
import './Footer.css';

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-info">
                        <p className="footer-description">
                            Your trusted online shop for quality products. Fast delivery and great customer service.
                        </p>
                    </div>

                    <ul className="footer-nav">
                        <li>
                            <Link 
                                to="/products" 
                                className="footer-link"
                            >
                                Buy Products Now
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/about" 
                                className="footer-link"
                            >
                                About Us
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/terms" 
                                className="footer-link"
                            >
                                Terms & Conditions
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/delivery" 
                                className="footer-link"
                            >
                                Payment & Delivery
                            </Link>
                        </li>
                    </ul>
                </div>

                <p className="footer-copyright">
                    Copyright &copy; {new Date().getFullYear()}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}