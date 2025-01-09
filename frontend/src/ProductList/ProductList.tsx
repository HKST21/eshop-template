import React, { useEffect, useState } from "react";
import eshop from "../class/eshopFeClass";
import { Product } from "../types/types";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";

interface ProductListProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function ProductList({ cart, setCart }: ProductListProps) {
    const [products, setProducts] = useState<Product[] | undefined>([]);

    useEffect(() => {
        const loadProducts = async () => {
            const productsFromDb = await eshop.getProducts();

            setProducts(productsFromDb)
        };

        loadProducts();
    }, []);

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

    return (
        <div>
            {products ? products.map((product, i) => (
                <div key={i}>
                    <Link to={`/products/${product.id}`}>
                        <div>
                            {product.name}
                            <p />
                            {product.description}
                            <p />
                            {product.stockQuantity}
                            <p />
                            {product.price}
                            <p />
                            {product.imageUrl}
                        </div>
                    </Link>
                    <p />
                    {product.stockQuantity > 0 ? (
                        <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    ) : (
                        <button disabled>Add To Cart</button>
                    )}
                    {cart ? (
                        <button onClick={() => handleRemoveFromCart(product.id)}>Remove from Cart</button>
                    ) : null}
                    <p />
                </div>
            )) : "Loading Products"}
        </div>
    );
}