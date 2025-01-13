import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartItem } from "../types/types";
import './Cart.css'


interface CartProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    onClose: () => void
}

export function Cart({ cart, setCart, onClose }: CartProps) {


    const totalPrice = cart.reduce((acc, item) => acc + item.product.price, 0);

    const navigate = useNavigate(); // inicialize useNavigate


    const handleCheckout = () => {
        onClose();
        navigate("/checkout") // navigate to route where checkout is
    }

    return (
        <div className="drawer-container">
            <div className="drawer-overlay" onClick={onClose}></div>
            <div className="drawer-content">
                <div>
                    
                    <p />
                    <h3>YOUR CART</h3>
                    {cart && cart?.map((item, i) => (
                        <div key={i} className="each-item">
                                {item.product.name}
                                <p />
                                QUANTITY {item.quantity}
                                <p />
                                PRICE {item.product.price} EUR
                                <p />
                        </div>
                    ))}
                    <div>TOTAL AMOUNT TO PAY {totalPrice} EUR</div>

                    <p />
                </div>
                <div>
                    <button onClick={handleCheckout}>CHECKOUT</button>
                    <button onClick={onClose}>CLOSE</button>
                </div>
            </div>
        </div>
    )
}