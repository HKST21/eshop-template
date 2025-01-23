import React, { useState } from "react"
import { CustomerData } from "../types/types"

export function Registration() {

    const [formValidity, setFormValidity] = useState<boolean>(false);



    const [customer, setCustomer] = useState<CustomerData>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: 0,
        deliveryAddress: "",
        password: ""
    })

    const handleOnChangeSetUser = (e: React.FormEvent<HTMLFormElement>) => {

        const formCustomer = {
            firstName: e.currentTarget.firstName.value,
            lastName: e.currentTarget.lastName.value,
            email: e.currentTarget.email.value,
            phoneNumber: Number(e.currentTarget.phoneNumber.value),
            deliveryAddress: e.currentTarget.deliveryAddress.value,
            password: e.currentTarget.password.value
        }

        setCustomer(formCustomer)

        console.log(formCustomer)

    }

    const handleOnKeyUpValidate = (e: React.KeyboardEvent<HTMLFormElement>) => {

        if (customer.firstName.length > 1 && customer.lastName.length > 1 && customer.email.includes("@") && customer.phoneNumber.toString().length > 8 && customer.phoneNumber.toString().length < 10 && customer.password && customer.password.length > 6) {

            setFormValidity(true)

        } else {
            setFormValidity(false)
        }


    }

    const handleConfirmRegistration = (e: React.MouseEvent<HTMLButtonElement>) => {

        e.preventDefault();

        console.log("Iam registring with this object", customer)

    }




    return (
        <div>
            <form onChange={handleOnChangeSetUser} onKeyUp={handleOnKeyUpValidate}>
                <input
                    placeholder="first name"
                    name="firstName"
                    type="text"
                />
                <input
                    placeholder="last name"
                    name="lastName"
                    type="text"
                />
                <input
                    placeholder="email"
                    name="email"
                    type="email"
                />
                <input
                    placeholder="phone number"
                    name="phoneNumber"
                    type="number"
                />
                <input
                    placeholder="delivery address"
                    name="deliveryAddress"
                    type="text"
                />
                <input
                    placeholder="password"
                    name="password"
                    type="password"
                />
                <br/>
                {!formValidity ? "Please fill in all inputs correctly": ""}
                <br/>
                <button type="submit" disabled={!formValidity} onClick={handleConfirmRegistration}>CONFIRM</button>
            </form>
        </div>
    )
}