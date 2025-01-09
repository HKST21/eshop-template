import React, { useState } from "react";
import eshop from "../class/eshopFeClass";
import { CartItem } from "../types/types";
import { Link } from "react-router-dom";
import SuccessModal from "../SuccesModal/SuccesModal";

interface CartProps {
    cart: CartItem[];
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
    onClose: () => void
}

export function Cart({ cart, setCart, onClose }: CartProps) {


    const [checkout, setCheckout] = useState<boolean>(false);

    const [termsAccepted, setTermsAccepted] = useState(false);

    const [showFinalConfirm, setShowFinalConfirm] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);



    const handleConfirmOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!showFinalConfirm) {
            // show another confirm dialogue
            setShowFinalConfirm(true);
            return;
        }

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
            try {
                console.log('Odesílaná data:', { customer, confirmedCart });
                await eshop.createOrder(customer, confirmedCart);

                setCart([]);

                setShowFinalConfirm(false);

                onClose();

                alert('✅ORDER WAS SUCCESFULLY ACCEPTED, YOU WILL RECEIE CONFIRMATION IN YOUR EMAIL');

            }

            catch (e) {
                console.error('Detail chyby při vytváření objednávky:', e);
                alert('FAILED CREATE ORDER')
            }


        }


    }


    return (
        <>
            <div>
                {showSuccessModal && <SuccessModal
                    onClose={() => {
                        setShowSuccessModal(false);
                        onClose();
                    }}
                />}
            </div>
            {showFinalConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p>I am confirming I read properly terms and conditions and I want to order the chosen products.</p>
                        <button
                            onClick={() => setShowFinalConfirm(false)}
                            className="mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="orderForm"
                        >
                            Confirm Order
                        </button>
                    </div>
                </div>
            )}
            <div>Košík {cart && cart?.map((item, i) => (
                <div key={i}>
                    {item.product.name}
                    {item.product.price}
                    {item.quantity}

                    <button onClick={onClose}>✕</button>
                </div>
            ))}
                <div>Celková cena: {totalPrice} Kč</div>
            </div>


            <div>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg" onClick={() => setCheckout(true)}>Checkout</button>
            </div>
            <div>
                {checkout ?
                    <div>
                        <form id="orderForm" onSubmit={handleConfirmOrder} >
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
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <label htmlFor="terms">
                                I am accepting
                                <Link
                                    to="/terms"
                                    className="text-blue-600 hover:text-blue-800 mx-1"
                                    target="_blank"
                                >
                                    terms and conditions
                                </Link>
                            </label>

                            <button type="submit">CONFIRM ORDER</button>
                        </form>
                    </div> : null}
            </div>
        </>
    )
}