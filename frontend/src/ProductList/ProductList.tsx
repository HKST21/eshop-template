import React, { useEffect, useState } from "react";
import eshop from "../class/eshopFeClass";
import { Product } from "../types/types";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";
import './ProductList.css'
import { ShoppingCart } from 'lucide-react'


interface ProductListProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
    products: Product[];
}

interface HoverState {
    id: number | null;
    visible: boolean;
}

export function ProductList({ cart, setCart, products }: ProductListProps) {

    const [picHovered, setPicHovered] = useState<HoverState>({
        id: null,
        visible: false
    })
    
    const handleAddToCart = (product: Product) => {

        if (product.stockQuantity <= 0) {
            alert('Product is nont in stock.');
            return;
        }

        // firstly we have to check if the item already exists in cart
        const existingitem = cart.find((item) => product.id === item.product.id);


        if (existingitem) {

            if (existingitem.quantity >= product.stockQuantity) {
                alert(`Due low stock quantity, you can order maximally ${product.stockQuantity} pcs.`);

                return
            }

            const quantityModifiedCart = cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);

            setCart(quantityModifiedCart)
        }

        else {
            const newCartItem: CartItem = {
                quantity: 1,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price
                }
            };

            // Přidáme do existujícího košíku pomocí setCart
            setCart([...cart, newCartItem]);
        }

    };

    const handleRemoveFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const handleOnMouseEnterImg = (id: number | undefined) => {
        setPicHovered({
            id: id ?? null,
            visible: true
        })
    }

    const handleOnMouseLeaveImg = (id: number | undefined) => {
        setPicHovered({
            id: id ?? null,
            visible: false
        })
    }

    return (
        <div className="productList-container">
            {products ? products.map((product, i) => (
                <div className="each-product" key={i}>
                    <Link to={`/products/${product.id}`}>
                        <div>
                            {product.name}
                            <p />
                            <span style={{ color: product.stockQuantity > 0 ? 'green' : '#d40606' }}>
                                {product.stockQuantity > 0 ? 'in stock' : 'out of stock'}
                            </span>
                            <p />
                            € {product.price}
                            <p />
                            <img 
                            onMouseEnter={() => handleOnMouseEnterImg(product.id)} 
                            onMouseLeave={() => handleOnMouseLeaveImg(product.id)} 
                            className={`product-image ${picHovered.id === product.id && picHovered.visible ? "product-image-hovered" : ""}`}
                                src={product.image_url}
                                alt={product.name}
                            >
                            </img>

                        </div>
                    </Link>
                    <p />
                    <div className="button-group">
                        {product.stockQuantity > 0 ? (
                            <button onClick={() => handleAddToCart(product)}>
                                <ShoppingCart size={25} />
                                <span>TO CART</span>
                            </button>
                        ) : (
                            <button disabled>
                                <ShoppingCart size={20} />
                                <span>TO CART</span>
                            </button>
                        )}
                        {cart.some(item => product.id === item.product.id) ? (
                            <button onClick={() => handleRemoveFromCart(product.id as number)}>REMOVE</button>
                        ) : null}
                    </div>
                    <p />
                </div>
            )) : "Loading Products"}
        </div>
    );
}