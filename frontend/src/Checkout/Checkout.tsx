import { useEffect, useState, useRef } from "react";

import { CartItem } from "../types/types"

import eshop from "../class/eshopFeClass";

import { Link } from "react-router-dom";

import SuccessModal from "../SuccesModal/SuccesModal";

import './Checkout.css'

interface CheckoutProps {
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

export function Checkout({ cart, setCart }: CheckoutProps) {


    const [termsAccepted, setTermsAccepted] = useState(false);

    const [showFinalConfirm, setShowFinalConfirm] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [zip, setZip] = useState<string>("");

    const [zipValidation, setZipValidation] = useState("");

    const formRef = useRef<HTMLFormElement>(null); // vytvoříme referenci na inputy. nastavujeme počáteční hodnotu na null, protože na null nastavujeme, pokud neinicializujeme s nějakou pevnou hodnotou třeba na 0 u čísel jako časovač, ale hodnotu čteme až elementu (jako zde z inputu) které musí vytvořit dom. Jednoduše DOM elementy vytvoří react až po tom co čte kod, takže při prvnim čtení je to null.

    // HTMLFormElement je element na který odkazuje ref




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

            //TODO: vyřešit, aby se posílal na backend i zip code


        }

        const confirmedCart = cart;

        if (customer && confirmedCart) {
            try {
                console.log('Odesílaná data:', { customer, confirmedCart });
                await eshop.createOrder(customer, confirmedCart);

                setCart([]);

                setShowFinalConfirm(false);

                setShowSuccessModal(true);

                formRef.current?.reset(); // current je aktuální hodnota ? protože můžeš být null při incializaci, reset() je metoda HTML formu

            }

            catch (e) {
                console.error('Detail chyby při vytváření objednávky:', e);
                alert('FAILED CREATE ORDER')
            }


        }


    }

    const handleOnChangeZip = (e: React.ChangeEvent<HTMLInputElement>) => {

        const inputZip = e.target.value;

        setZip(inputZip)

        

    }

    const handleOnBlurZip = () => {

        const validateZip = () => {
            
            const cleanZip = zip.replace(/\s/g, '');

            const zipRegex = /^[0-9]{5}$/;

            if (!cleanZip) {
                setZipValidation("ZIP is obligatory")
            }

            if (!zipRegex.test(cleanZip)) {
                setZipValidation("ZIP format invalid")
            }

            if (cleanZip === "") {
                setZipValidation("")
            }

            if(zipRegex.test(cleanZip)) {
                setZipValidation("")
            }
        };

        validateZip()
    }




    return (
        <>
            <div>
                {showSuccessModal && <SuccessModal
                    onClose={() => {
                        setShowSuccessModal(false);

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

            <div className="checkout-container">

                <div>
                    <div className="ordered-products">
                        <h3>You added these products to your cart, please proceed further</h3>
                        {cart.map((item, i) => (
                            <div key={i} className="product-item">
                                    <div>{item.product.name}</div>
                                    <div>{item.product.price} EUR</div>
                                    <div>Amount: {item.quantity}</div>
                            </div>
                        ))}
                    </div>
                </div>


                <form id="orderForm" onSubmit={handleConfirmOrder} ref={formRef} >
                    {/* POZOR VÝŠE MUSÍ BÝT ref připojena na proměnou s useRef!  */}
                    <div>YOUR DELIVERY DETAILS</div>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="FIRST NAME"
                        required>
                    </input>
                    <p />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="LAST NAME"
                        required>
                    </input>
                    <p />
                    <input
                        type="text"
                        name="email"
                        placeholder="EMAIL"
                        required>
                    </input>
                    <p />
                    <input
                        type="text"
                        name="phoneNumber"
                        placeholder="PHONE NUMBER"
                        required>
                    </input>
                    <p />
                    <input
                    type="text"
                    name="zipCode"
                    placeholder="ZIP CODE"
                    value={zip}
                    onChange={handleOnChangeZip}
                    onBlur={handleOnBlurZip}
                    required>
                    </input>
                    {zipValidation !== "" && zipValidation }
                    <input className="inad"
                        type="text"
                        name="deliveryAddress"
                        placeholder="FULL ADDRESS"
                        required>
                    </input>
                    <p />
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <p />
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
                    <p />
                    <p />
                    <button type="submit">CONFIRM ORDER</button>
                </form>
            </div>

        </>
    )
}
