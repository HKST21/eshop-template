import sqlite3 from 'sqlite3';  // Import SQLite knihovny
import { Product, CartItem, Order, OrderItem } from '../types/types';  // Import interface pro produkt

export class EshopBeClass {
    private db: sqlite3.Database;  // Instance databáze (private = přístupná jen uvnitř třídy)

    constructor() {
        // Constructor se spustí při vytvoření instance třídy
        this.db = new sqlite3.Database('./src/db/database.sqlite');  // Připojení k databázi
        this.initDB();  // Inicializace databáze
    }

    private async initDB() {
        return new Promise((resolve, reject) => {
            const sql = `
                CREATE TABLE IF NOT EXISTS products ( 
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    name TEXT NOT NULL, 
                    price REAL NOT NULL,
                    description TEXT,
                    stockQuantity INTEGER NOT NULL DEFAULT 0,
                    image_url TEXT
                )
            `;

            this.db.run(sql, (err) => {
                if (err) {
                    console.error('Chyba při vytváření tabulky:', err);
                    reject(err);
                } else {
                    console.log('Databáze byla úspěšně inicializována');
                    resolve(true);
                }
            });
        });
    }

    async insertTestProducts() {
        const products = [
            { id: 1, name: 'Iphone S21', price: 11990, description: 'Úplně nový Iphone S21Pro', stockQuantity: 1, imageUrl: "https://image.alza.cz/products/RI045b1/RI045b1-02.jpg?width=1000&height=1000" },
            { id: 2, name: 'Samsung L7', price: 10120, description: 'Úplně nový Samsung L7, výkonný mobilní telefon z Koree', stockQuantity: 2, imageUrl: "https://image.alza.cz/products/SAMO0263b3/SAMO0263b3-09.jpg?width=1000&height=1000" }
        ];

        // Upravený SQL dotaz - přidány všechny sloupce
        const stmt = this.db.prepare('INSERT INTO products (name, price, description, stockQuantity, image_url) VALUES (?, ?, ?, ?, ?)');

        for (const product of products) {
            await new Promise((resolve, reject) => {
                stmt.run([
                    product.name,
                    product.price,
                    product.description,
                    product.stockQuantity,
                    product.imageUrl
                ], (err) => {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        }
    }

    async createProduct(product: Product): Promise<number> {
        // Metoda pro vytvoření produktu v databázi
        return new Promise((resolve, reject) => {
            this.db.run(
                // SQL příkaz pro vložení produktu
                'INSERT INTO products (name, price, description, stockQuantity, image_url) VALUES (?, ?, ?, ?, ?)',
                // Hodnoty které se vloží místo otazníků
                [product.name, product.price, product.description, product.stockQuantity, product.imageUrl],
                function (err) {
                    if (err) reject(err);  // Pokud nastane chyba
                    resolve(this.lastID);   // Vrátí ID nově vytvořeného produktu
                }
            );
        });
    }

    async getProducts(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM products', (err, rows: Product[]) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    async getProductById(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM products WHERE id = ?', [id], (err, row: Product) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }

    /**
     * Validuje dostupnost všech položek v košíku před vytvořením objednávky
     * @param cartItems - Pole položek v košíku, které chce uživatel objednat
     */
    async validateAndCreateOrder(cartItems: CartItem[]) {
        // Procházíme postupně každou položku v košíku
        // 'item' reprezentuje jeden produkt v košíku a jeho množství. použijeme for cyklus
        try {

            for (const item of cartItems) {

                // Pro každou položku v košíku najdeme odpovídající produkt v databázi a uložíme ho do proměnné, v jedné iterace procházení například prvního itemu, to bude napárovaný product v databázi podle id
                const product = await this.getProductById(item.product.id);

                // Porovnáváme:
                // - product.stockQuantity: kolik kusů je skutečně na skladě
                // - item.quantity: kolik kusů chce uživatel koupit
                if (product.stockQuantity < item.quantity) {
                    // Pokud není dostatek kusů na skladě, vyhodíme chybu
                    // Tato chyba informuje frontend, že objednávku nelze dokončit
                    throw new Error(`Produkt ${product.name} není skladem v požadovaném množství`)
                }
                // Pokud je dostatek kusů, cyklus pokračuje na další položku
            }

            const orderSuma = cartItems.reduce((acc, item) => {
                return acc + (item.product.price * item.quantity);
            }, 0);

            // 3. Vytvoření objednávky
            const orderId = await new Promise<number>((resolve, reject) => {
                this.db.run(
                    'INSERT INTO orders (total_price, date) VALUES (?, CURRENT_TIMESTAMP)',
                    [orderSuma],
                    function (err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });

            // 4. Vytvoření položek objednávky a aktualizace skladu
            const orderItems: OrderItem[] = [];
            for (const item of cartItems) {
                // Vytvoření záznamu v order_items
                const orderItemId = await new Promise<number>((resolve, reject) => {
                    this.db.run(
                        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
                        [orderId, item.product.id, item.quantity],
                        function (err) {
                            if (err) reject(err);
                            resolve(this.lastID);
                        }
                    );
                });

                // Aktualizace skladových zásob
                await new Promise((resolve, reject) => {
                    this.db.run(
                        'UPDATE products SET stockQuantity = stockQuantity - ? WHERE id = ?',
                        [item.quantity, item.product.id],
                        (err) => {
                            if (err) reject(err);
                            resolve(true);
                        }
                    );
                });

                orderItems.push({
                    id: orderItemId,
                    order_id: orderId,
                    product_id: item.product.id,
                    quantity: item.quantity
                });
            }

            // 5. Vytvoření emailové notifikace
            const emailContent = `
            Děkujeme za Vaši objednávku č. ${orderId}!
            
            Shrnutí objednávky:
            ${cartItems.map(item => `
                Produkt: ${item.product.name}
                Množství: ${item.quantity}
                Cena za kus: ${item.product.price} EUR
                Mezisoučet: ${item.product.price * item.quantity} EUR
            `).join('\n')}
            
            Celková cena: ${orderSuma} EUR
            
            O dalším průběhu objednávky Vás budeme informovat.
            
            S pozdravem,
            Váš eshop
        `;

            // TODO: Implementace odeslání emailu
            console.log('Email pro zákazníka:', emailContent);

            // 6. Vrácení vytvořené objednávky
            const order: Order = {
                id: orderId,
                customer_id: null, // Prozatím null, později můžete přidat customer_id
                date: new Date().toISOString(),
                total_price: orderSuma,
                items: orderItems
            };

            return order;

        } catch (error) {
            console.error('Chyba při vytváření objednávky:', error);
            throw error;
        }

    }

}