/*
interface musí odpovídat struktuře ve schema.sql datošce, kde to jsou sloupce v rámci CREATE TABLE **/
export interface Product {
    id: number,
    name: string,
    price: number,
    description: string,
    stockQuantity: number,
    image_url: string

};


export interface CartItem { // do vlastnosti produkt vnořím objekt product, který má podobnou strukturu jako v interfacu Product
    quantity: number,
    product: {
        id: number,
        name: string,
        price: number,
        
    }
    
};

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
    phoneNumber: number,
    deliveryAddress: string

};

export interface CreateOrderRequest {
    cartItems: CartItem[];
    customerData: CustomerData;
}

