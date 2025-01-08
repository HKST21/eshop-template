import React, { useEffect, useState } from "react";
import eshop from "../class/eshopFeClass";
import { Product } from "../types/types";
import { CartItem } from "../types/types";
import { Cart } from "../Cart/Cart";

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
    },[]);

    const handleAddToCart = (product: Product) => {
        // Vytvoříme nový CartItem
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
    };

    const handleRemoveFromCart = (productId: number) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };


    return (
        <div>
            {products ? products.map((product, i) => (
                <div key={i}>
                    {product.name}
                    <p />
                    {product.description}
                    <p />
                    {product.stockQuantity}
                    <p />
                    {product.price}
                    <p />
                    {product.imageUrl}
                    <p />
                    <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                    {cart ? (
                        <button onClick={() => handleRemoveFromCart(product.id)}>Remove from Cart</button>
                    ) : null}
                    <p />
                </div>
            )) : "Loading Products"}

            <div>
            {cart.length > 0 && (
                <Cart cart={cart} setCart={setCart} />
            )}
            </div>
        </div>
    )


}