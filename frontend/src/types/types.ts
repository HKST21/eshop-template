/*
interface musí odpovídat struktuře ve schema.sql datošce, kde to jsou sloupce v rámci CREATE TABLE **/
export interface Product {
    id: number,
    name: string,
    price: number,
    discount?: number,
    description: string,
    stockQuantity: number,
    image_url: string,
    final_price?: number  // Přidáme pole pro vypočítanou cenu po slevě
}


export interface CartItem {
    quantity: number,
    product: {
        id: number,
        name: string,
        price: number,
        discount?: number  // přidáme discount i do košíku
    }
}

// Interface pro jednu položku v objednávce
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
};

// Interface pro celou objednávku
export interface Order {
    id: number;
    customer_id: number | null;  // může být null pokud nemáme zákazníka
    date: string;  // ISO string pro datum
    total_price: number;
    items?: OrderItem[];  // volitelné pole položek (pokud je budeme chtít načítat společně s objednávkou)
};

export interface CustomerData {
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    deliveryAddress: string,
    password?: string

};

export interface CreateOrderRequest {
    cartItems: CartItem[];
    customerData: CustomerData;
}

