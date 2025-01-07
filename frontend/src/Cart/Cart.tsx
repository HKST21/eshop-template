import React, { useEffect, useState } from "react";
import eshop from "../class/eshopFeClass";
import { CartItem, Product } from "../types/types";


export function Cart() {

    const [cart, setCart] = useState<CartItem[]>([]); // inicialize with empty array
    const [checkout, setCheckout] = useState<boolean>(false)

    useEffect(() => {

        const fetchProducts = async () => {
            const allProducts = await eshop.getProducts(); // array of type products

            if (allProducts) {

                const cartItems = allProducts.map((product: Product) => ({ // we have to transform the structure of objects in array to CartItem to set it in cart state
                    quantity: 1,
                    product: {
                        id: product.id,
                        name: product.name,
                        price: product.price
                    }
                }

                ))
                setCart(cartItems)
            }

        }
        fetchProducts();

    }, []);

    const handleAddToCart = (productId: number) => {
        eshop.addToCart(productId)

    };

    const handleRemoveFromCart = (productId: number) => {
        eshop.removeFromCart(productId)
    };

    const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget); // saving in formData inputs from form.

        const customer = { // creating customer object based on CustomerData intfc

            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            phoneNumber: Number(formData.get('phoneNumber')), //warn
            deliveryAddress: formData.get('deliveryAddress') as string
            

        }

        const confirmedCart = cart;

        if (customer && confirmedCart) {

            eshop.createOrder(customer, confirmedCart)
        }

       
    }


    return (
        <>
            <div>Košík {cart && cart?.map((item, i) => (
                <div key={i}>
                    {item.product.name}
                    {item.product.price}
                    {item.quantity}
                    <button onClick={() => handleAddToCart(item.product.id)}>Add to Cart</button>
                    {cart ? (
                        <button onClick={() => handleRemoveFromCart(item.product.id)}>Remove from Cart</button>
                    ) : null}
                </div>
            ))
            }</div>

            <div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={() => setCheckout(true)}>Checkout</button>
            </div>
            <div>
            {checkout? 
            <div>
                <form onSubmit={handleConfirmOrder} >
                    <input
                    type="text"
                    name="firstName"
                    placeholder="FIRST NAME"
                    required>
                    </input>
                    <input
                    type="text"
                    name="lastName"
                    placeholder="LAST NAME"
                    required>
                    </input>
                    <input
                    type="text"
                    name="email"
                    placeholder="EMAIL"
                    required>
                    </input>
                    <input
                    type="number"
                    name="phoneNumber"
                    placeholder="PHONE NUMBER"
                    required>
                    </input>
                    <input
                    type="text"
                    name="deliveryAddress"
                    placeholder="FULL ADDRESS INCLUDING COUNTRY AND ZIP CODE"
                    required>
                    </input>
                    <button type="submit">CONFIRM ORDER</button>
                </form>
            </div>: null}
            </div>
        </>
    )
}