import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import eshop from "../class/eshopFeClass";
import { Product } from '../types/types';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from "../types/types";
import "./ProductDetail.css"

interface ProductListProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function ProductDetail({ cart, setCart }: ProductListProps) {

    const [product, setProduct] = useState<Product | null>();

    const { id } = useParams(); // take id from toute

    useEffect(() => {

        const loadProduct = async () => {

            if (id) {
                const productWithDetail = await eshop.getProductById(id);

                setProduct(productWithDetail)
            }
        }
        loadProduct()
    }, [id]);

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
        if (product) {
            setCart(cart.filter(item => item.product.id !== productId));
        }

    };


    return (
        <div className="productDescription-container">
            <h3>{product?.name}</h3>
            <p />
            <img className="product-image-desc"
                src={product?.image_url}></img>
            <p />
            Description:
            {" " + product?.description}
            <p />
            Stock quantity: {product?.stockQuantity
                ? <span>Product is currently <span style={{ color: 'green' }}>on stock</span>, we have {product?.stockQuantity} piece</span>
                : <span>Product is <span style={{ color: '#d40606' }}>out of stock</span></span>}
            <p />
            € {product?.price}
            <div className="button-group-desc">
                {product?.stockQuantity ? (
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
                {cart.some(item => product?.id === item.product.id) ? (
                    <button onClick={() => handleRemoveFromCart(product?.id || 0)}>REMOVE</button>
                ) : null}
            </div>
        </div>

    )


}