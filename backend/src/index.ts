import express, { Request, Response } from 'express';
import cors from 'cors';
import { EshopBeClass } from "./class/eshopBeClass";
import multer from 'multer';


const app = express();
const port = process.env.PORT || 3010;

const upload = multer({
    storage: multer.memoryStorage(),  // Ukládáme soubor do paměti
    limits: {
        fileSize: 5 * 1024 * 1024  // Omezení velikosti souboru na 5MB
    },
    fileFilter: (req, file, cb) => {
        // Povolíme pouze obrázky
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(null, false);
            cb(new Error('Pouze obrázky jsou povoleny!'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());  // Pro JSON data
app.use(express.static('public'));  // Pro servírování statických souborů (obrázků)

// Inicializace instance třídy pro práci s databází
const eshopBe = new EshopBeClass();

//inicializace dat jednoduchá funkce na vložení testovacích produktů do classy

console.log('=== Backend server starting ===');

async function initializeProducts () {

    try {
        await eshopBe.insertTestProducts();

        const products = await eshopBe.getProducts();

        console.log("eshop initialized with these products", products)

    }

    catch (err) {
        console.error("err", err)
    }

};

initializeProducts();

// GET /api/products - Získání všech produktů
app.get('/api/products', async (req: Request, res: Response) => {

    try {
        const products = await eshopBe.getProducts();
        res.json(products)
    }
    catch (e) {
        console.error("failed to getProducts from BE", e)
    }
    
});
// GET produkty podle ID
app.get('/api/products/:id', async (req: Request, res: Response) => {
    
    try {
        const productId = parseInt(req.params.id); // // Získání ID produktu z URL parametru a převod na číslo

        const product = await eshopBe.getProductById(productId);

        res.json(product);

    }
    catch (e) { 
        console.error("failed getting product by id", e)
    }
});

// POST vytvoření produktu
app.post('/api/products', upload.single('image'), async (req: Request, res: Response) => {
    try {

        const productData = JSON.parse(req.body.product);


        const newAddedProduct = await eshopBe.createProduct(productData, req.file?.buffer, req.file?.originalname);

        res.json(newAddedProduct)
    }

    catch (e) {
        console.error("failed create new product", e)
    }
});

app.post('/api/orders', async (req: Request, res: Response) => {
    console.log('Received order data:', req.body);
    try {
        const orderData = req.body; // vytahneme data z req body
        console.log('Přijatá data', orderData);
        const newAddedOrder = await eshopBe.validateAndCreateOrder(orderData.cartItems, orderData.customerData); // k datum pristoupime jako k objektu s vlastnostmi
        res.json(newAddedOrder);
    }
    catch (e: any) {
        console.error("Detail chyby:", e); 
        console.error("failed create new order", e);
        res.status(500).send(e.message);
    }
});
app.listen(port, () => {
    console.log(`Server běží na http://localhost:${port}`);
});