import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types/types';
import { Cart } from '../Cart/Cart';
import './Header.css';

interface HeaderProps {
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    stickyHeader: boolean
}

export function Header({ cart, setCart, stickyHeader }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <header className={`header ${stickyHeader ? "sticky" : ""}`}>
            <div className="header-container">
                <div className="nav-wrapper">
                    <div className="logo">
                        <a href="/" className="logo-link">
                            YourShop
                        </a>
                    </div>

                    <nav className="desktop-menu">
                        <Link to="/products" className="nav-link-red">
                            Buy Products Now
                        </Link>
                        <Link to="/about" className="nav-link">
                            About Us
                        </Link>
                        <Link to="/terms" className="nav-link">
                            Terms and Conditions
                        </Link>
                        <Link to="/delivery" className="nav-link">
                            Payment and Delivery
                        </Link>
                    </nav>

                    <div>
                        <button className="cart-button" onClick={() => setIsCartOpen(true)}>
                            <svg
                                className="cart-icon"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cart.length > 0 && (
                                <span>
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {isCartOpen && (
                            
                                <Cart cart={cart} setCart={setCart} onClose={() => setIsCartOpen(false)} />
                            
                        )}
                    </div>

                    <div>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="mobile-menu-button"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg
                                    className="cart-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="cart-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                    <div>
                        <Link to="/products" className="mobile-menu-item">
                            Buy Products Now
                        </Link>
                        <Link to="/about" className="mobile-menu-item">
                            About Us
                        </Link>
                        <Link to="/terms" className="mobile-menu-item">
                            Terms and Conditions
                        </Link>
                        <Link to="/delivery" className="mobile-menu-item">
                            Payment and Delivery
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}