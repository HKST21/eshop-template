import { CartItem, CustomerData, } from "../types/types";

const BASE_URL = '/api';

class eshopFeClass {

    cart: CartItem[] // typing cart

    constructor() {
        this.cart = []

    }

    async addToCart(productId: number): Promise<void> {
        try {

            const response = await fetch(`${BASE_URL}/products/${productId}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch product with id ${productId}`);
            };

            const product = await response.json();

            const cartItem = { // CartItem typ má jinou strukturu než product na BE, proto vytvoříme nový objekt, který pak pushneme do pole.
                quantity: 1,
                product: {
                    id: product.id,
                    name: product.name,
                    price: product.price
                }
            }

            this.cart.push(cartItem);

        }

        catch (e) {
            console.error("error fetching add to Cart")
        }

    };

    removeFromCart(productId: number): void {

        this.cart = this.cart.filter((item) => item.product.id !== productId); // modifiyng of array directly with filter method, which filters out item by productId. technically new arr.


    }

    async getProducts() {
        try {

            const response = await fetch(`${BASE_URL}/products`);

            if (!response.ok) {
                throw new Error('failed to get products from BE')
            }

            const products = await response.json();

            return products
        }

        catch (e) {
            console.error("error fetching add to Cart");
        }
    }


    getCart() {

        return this.cart;
    };

    async createOrder(customerData: CustomerData, cartItems: CartItem[]) {

        try {

            const response = await fetch(`${BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    cartItems: cartItems,
                    customerData: customerData
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            return await response.json();

        }

        catch (e) {
            console.error('Error fetching tix and seatings', e);
            throw e

        }

    }




}

const eshop = new eshopFeClass;

export default eshop