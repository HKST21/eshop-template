import React, {  useState } from "react";
import eshop from "../class/eshopFeClass";
import { CartItem } from "../types/types";

interface CartProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export function Cart({ cart, setCart }: CartProps) {

    
    const [checkout, setCheckout] = useState<boolean>(false);

    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);



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
                    <div>Celková cena: {totalPrice} Kč</div>
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