import { CartItem, CustomerData, Product, } from "../types/types";

const BASE_URL = '/api';

class eshopFeClass {

    cart: CartItem[] // typing cart

    constructor() {
        this.cart = []

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

    async getProductById(id: string) {
        try {
            const response = await fetch(`${BASE_URL}/products/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            return await response.json();
        } catch (e) {
            console.error("Error fetching product:", e);
            throw e;
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
            console.error('Error fetching creating order', e);
            throw e

        }

    }

    async createProduct(product : FormData): Promise<Response> {

        try {
            console.log('create product called')

            const response = await fetch(`${BASE_URL}/products`, {
                method: 'POST',
                                // form data nepotřebuje hlavičku
                body: product
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            return await response.json();

        }

        catch (e) {
            console.log("error fetching creating product", e)
            throw e;

        }

    }

    async editProduct (id: number, product: Object) : Promise<Response>  {

        try {
            console.log("Chceme editovat tento produkt", product)
            const response = await fetch(`${BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(product)
            }
                
            )

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`)
            }

            return await response.json();

        }
        

        catch (e) {
            console.error("failed to post editedProduct to endpoint", e)
            throw e
        }

        

    }

    




}

const eshop = new eshopFeClass;

export default eshop