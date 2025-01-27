import sqlite3 from 'sqlite3';  // Import SQLite knihovny
import { Product, CartItem, Order, OrderItem, CustomerData } from '../types/types';  // Import interface pro produkt
import fs from 'fs';
import path from 'path';

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
                    image_url TEXT,
                    discount INTEGER DEFAULT 0
                );
    
                CREATE TABLE IF NOT EXISTS customers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    phone TEXT
                );
    
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    customer_id INTEGER,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    total_price REAL NOT NULL,
                    FOREIGN KEY (customer_id) REFERENCES customers(id)
                );
    
                CREATE TABLE IF NOT EXISTS order_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_id INTEGER,
                    product_id INTEGER,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(id),
                    FOREIGN KEY (product_id) REFERENCES products(id)
                );
            `;

            this.db.exec(sql, (err) => {
                if (err) {
                    console.error('Chyba při vytváření tabulek:', err);
                    reject(err);
                } else {
                    console.log('Databáze byla úspěšně inicializována');
                    resolve(true);
                }
            });
        });
    }

    private async saveImage(imageBuffer: Buffer, fileName: string): Promise<string> {
        try {
            // Upravíme cestu tak, aby směřovala do frontend/public/images
            const imagesDir = path.join(process.cwd(), '../frontend/public/images');
            
            console.log('Path to images directory:', imagesDir); // Pro kontrolu cesty
            
            // Vytvoříme složku images, pokud neexistuje
            if (!fs.existsSync(imagesDir)) {
                fs.mkdirSync(imagesDir, { recursive: true });
            }
    
            // Vytvoříme unikátní název souboru
            const fileExtension = path.extname(fileName);
            const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
            const filePath = path.join(imagesDir, uniqueFileName);
    
            // Zapíšeme soubor
            await fs.promises.writeFile(filePath, imageBuffer);
    
            // Vrátíme URL cestu k obrázku ve stejném formátu jako existující obrázky
            return `/images/${uniqueFileName}`;
        } catch (error) {
            console.error('Chyba při ukládání obrázku:', error);
            throw error;
        }
    }

    async insertTestProducts() {
        const existingProducts = await this.getProducts();

        const products = [
            {
                name: 'Iphone S21',
                price: 1990,
                description: 'Úplně nový Iphone S21Pro',
                stockQuantity: 1,
                image_url: "/images/iphone.png",
                discount: 10
            },
            {
                name: 'Samsung L7',
                price: 820,
                description: 'Úplně nový Samsung L7, výkonný mobilní telefon z Koree',
                stockQuantity: 2,
                image_url: "/images/samsung.png",
                discount: 15
            },
            {
                name: 'Alcatel S19',
                price: 2990,
                description: 'Alcatel od francouzského výrobce, velmi kvalitní produkt pro důchodce',
                stockQuantity: 1,
                image_url: "/images/samsung2.png"
            },
            {
                name: 'Xiaomi Redmi Note 12',
                price: 1990,
                description: 'Výkonný telefon střední třídy s kvalitním fotoaparátem a dlouhou výdrží baterie',
                stockQuantity: 3,
                image_url: "/images/iphone.png"
            },
            {
                name: 'OnePlus Nord CE',
                price: 890,
                description: 'Elegantní smartphone s rychlým nabíjením a čistým Android systémem',
                stockQuantity: 2,
                image_url: "/images/samsung.png"
            },
            {
                name: 'Huawei P40 Lite',
                price: 690,
                description: 'Moderní telefon s kvalitním fotoaparátem a vlastním ekosystémem aplikací',
                stockQuantity: 4,
                image_url: "/images/samsung2.png"
            },
            {
                name: 'Motorola Edge 30',
                price: 990,
                description: 'Prémiový telefon s 144Hz displejem a pokročilými funkcemi pro fotografy',
                stockQuantity: 1,
                image_url: "/images/iphone.png"
            },
            {
                name: 'Vivo V25',
                price: 890,
                description: 'Stylový telefon s pokročilými selfie funkcemi a rychlým 5G připojením',
                stockQuantity: 2,
                image_url: "/images/samsung2.png"
            },
            {
                name: 'Sony Xperia 5',
                price: 2990,
                description: 'Profesionální telefon s kinematografickým displejem a pokročilými funkcemi pro video',
                stockQuantity: 1,
                image_url: "/images/iphone.png"
            }
        ];

        const stmt = this.db.prepare('INSERT INTO products (name, price, description, stockQuantity, image_url, discount) VALUES (?, ?, ?, ?, ?, ?)');

        for (const product of products) {
            // Kontrola existence produktu
            const exists = existingProducts.some(existingProduct =>
                existingProduct.name === product.name
            );

            if (!exists) {
                await new Promise((resolve, reject) => {
                    stmt.run([
                        product.name,
                        product.price,
                        product.description,
                        product.stockQuantity,
                        product.image_url,
                        product.discount || 0
                    ], (err) => {
                        if (err) reject(err);
                        else {
                            console.log(`Přidán nový produkt: ${product.name}`);
                            resolve(true);
                        }
                    });
                });
            } else {
                console.log(`Produkt ${product.name} už existuje, přeskakuji`);
            }
        }

        console.log('Kontrola a přidání testovacích produktů dokončena');
    };

    async createProduct(product: Product, imageFile?: Buffer, imageFileName?: string): Promise<number> {
        try {
            let imagePath = product.image_url;
            
            // Pokud máme nový obrázek, uložíme ho
            if (imageFile && imageFileName) {
                imagePath = await this.saveImage(imageFile, imageFileName);
            }
    
            return new Promise((resolve, reject) => {
                this.db.run(
                    'INSERT INTO products (name, price, description, stockQuantity, image_url, discount) VALUES (?, ?, ?, ?, ?, ?)',
                    [
                        product.name,
                        product.price,
                        product.description,
                        product.stockQuantity,
                        imagePath,
                        product.discount || 0
                    ],
                    function (err) {
                        if (err) {
                            console.error('Chyba při vytváření produktu:', err);
                            reject(err);
                        }
                        resolve(this.lastID);
                    }
                );
            });
        } catch (error) {
            console.error('Chyba při vytváření produktu:', error);
            throw error;
        }
    }

    async getProducts(): Promise<Product[]> {
        return new Promise((resolve, reject) => {
            // Komplexní SQL dotaz pro výpočet finální ceny
            const sql = `
                SELECT *,
                    -- Výpočet finální ceny po slevě:
                    -- 1. Vezmeme původní cenu (price)
                    -- 2. Odečteme slevu (1 - discount/100)
                    -- 3. Zaokrouhlíme na 2 desetinná místa
                    -- 4. Pokud není discount definován (NULL), použijeme 0 (COALESCE)
                    ROUND(price * (1 - COALESCE(discount, 0) / 100.0), 2) as final_price 
                FROM products
            `;

            this.db.all(sql, (err, rows: Product[]) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    async getProductById(id: number): Promise<Product> {
        return new Promise((resolve, reject) => {
            this.db.get(
                `SELECT *,
                ROUND(price * (1 - COALESCE(discount, 0) / 100.0), 2) as final_price 
                FROM products WHERE id = ?`,
                [id],
                (err, row: Product) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });
    }

    

    /**
     * Validuje dostupnost všech položek v košíku před vytvořením objednávky
     * @param cartItems - Pole položek v košíku, které chce uživatel objednat
     */
    async validateAndCreateOrder(cartItems: CartItem[], customerData: CustomerData) {
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

            const customerId = await new Promise<number>((resolve, reject) => {
                this.db.run(
                    'INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)',
                    [`${customerData.firstName} ${customerData.lastName}`,
                    customerData.email,
                    customerData.phoneNumber],
                    function (err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });

            // 3. Výpočet celkové ceny
            const orderSuma = await cartItems.reduce(async (accPromise, item) => {
                const acc = await accPromise;
                const product = await this.getProductById(item.product.id);
                const discountMultiplier = 1 - (product.discount || 0) / 100;
                const itemPrice = product.price * discountMultiplier * item.quantity;
                return acc + itemPrice;
            }, Promise.resolve(0));

            // 4. Vytvoření objednávky s ID zákazníka
            const orderId = await new Promise<number>((resolve, reject) => {
                this.db.run(
                    'INSERT INTO orders (customer_id, total_price, date) VALUES (?, ?, CURRENT_TIMESTAMP)',
                    [customerId, orderSuma],
                    function (err) {
                        if (err) reject(err);
                        resolve(this.lastID);
                    }
                );
            });

            // 5. Vytvoření položek objednávky a aktualizace skladu
            const orderItems: OrderItem[] = [];
            for (const item of cartItems) {
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

            // 6. Příprava emailové notifikace
            const emailContent = `
    Děkujeme za Vaši objednávku č. ${orderId}!
    
    Údaje zákazníka:
    Jméno: ${customerData.firstName} ${customerData.lastName}
    Email: ${customerData.email}
    Telefon: ${customerData.phoneNumber}
    Doručovací adresa: ${customerData.deliveryAddress}
    
    Shrnutí objednávky:
    ${await Promise.all(cartItems.map(async item => {
                const product = await this.getProductById(item.product.id);
                const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
                return `
            Produkt: ${item.product.name}
            Množství: ${item.quantity}
            Původní cena: ${product.price} Kč
            ${product.discount ? `Sleva: ${product.discount}%` : ''}
            Cena po slevě: ${discountedPrice} Kč
            Mezisoučet: ${discountedPrice * item.quantity} Kč
        `;
            })).then(items => items.join('\n'))}
    
    Celková cena: ${orderSuma} Kč
    
    O dalším průběhu objednávky Vás budeme informovat.
    
    S pozdravem,
    Váš eshop
`;

            // TODO: Implementace odeslání emailu
            console.log('Email pro zákazníka:', emailContent);

            // 7. Vrácení vytvořené objednávky
            const order: Order = {
                id: orderId,
                customer_id: customerId,
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