import express, { Request, Response } from 'express';
import cors from 'cors';
import { EshopBeClass } from "./class/eshopBeClass";
import { Product } from './types/types';

const app = express();
const port = process.env.PORT || 3010;

// Middleware
app.use(cors());  // Povolení CORS pro frontend
app.use(express.json());  // Parsování JSON v body

// Inicializace instance třídy pro práci s databází
const eshopBe = new EshopBeClass();

//inicializace dat jednoduchá funkce na vložení testovacích produktů do classy

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
app.post('/api/products', async (req: Request, res: Response) => {
    try {
        const createdProduct = req.body;

        const newAddedProduct = await eshopBe.createProduct(createdProduct);

        res.json(newAddedProduct)
    }

    catch (e) {
        console.error("failed create new product", e)
    }
})