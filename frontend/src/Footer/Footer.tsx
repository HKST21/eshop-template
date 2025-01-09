import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer className="bg-gray-100">
            <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
                {/* Ponechte horní část footeru stejnou */}
                
                <div className="lg:flex lg:items-end lg:justify-between">
                    <div>
                        <div className="flex justify-center text-teal-600 lg:justify-start">
                            {/* Vaše logo zůstává stejné */}
                        </div>

                        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
                            Your trusted online shop for quality products. Fast delivery and great customer service.
                        </p>
                    </div>

                    <ul className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12">
                        <li>
                            <Link 
                                to="/products" 
                                className="text-gray-700 transition hover:text-gray-700/75"
                            >
                                Buy Products Now
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/about" 
                                className="text-gray-700 transition hover:text-gray-700/75"
                            >
                                About Us
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/terms" 
                                className="text-gray-700 transition hover:text-gray-700/75"
                            >
                                Terms & Conditions
                            </Link>
                        </li>

                        <li>
                            <Link 
                                to="/delivery" 
                                className="text-gray-700 transition hover:text-gray-700/75"
                            >
                                Payment & Delivery
                            </Link>
                        </li>
                    </ul>
                </div>

                <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
                    Copyright &copy; {new Date().getFullYear()}. All rights reserved.
                </p>
            </div>
        </footer>
    );
}