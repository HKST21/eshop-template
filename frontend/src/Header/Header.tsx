import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CartItem } from '../types/types';
import { Cart } from '../Cart/Cart';

interface HeaderProps {
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function Header({ cart, setCart }: HeaderProps) {

    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="text-xl font-bold text-gray-900">
                            YourShop
                        </a>
                    </div>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex space-x-8">
                        <Link to="/products" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            Buy Products Now
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            About Us
                        </Link>
                        <Link to="/terms" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            Terms and Conditions
                        </Link>
                        <Link to="/delivery" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                            Payment and Delivery
                        </Link>
                    </nav>

                    <div>
                        <button onClick={() => setIsCartOpen(true)}>
                            <svg
                                className="w-6 h-6"
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
                            <div>
                                <Cart cart={cart} setCart={setCart} onClose={() => setIsCartOpen(false)} />
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg
                                    className="h-6 w-6"
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
                                    className="h-6 w-6"
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

                {/* Mobile Menu Panel */}
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a href="/products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Buy Products Now
                            </a>
                            <a href="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                About Us
                            </a>
                            <a href="/terms" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Terms and Conditions
                            </a>
                            <a href="/delivery" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                                Payment and Delivery
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}