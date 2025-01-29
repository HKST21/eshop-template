import './index.css'
import { Layout } from './Layout/Layout'
import { CartItem, Product } from './types/types'
import { Terms } from './Terms/Terms'
import { Delivery } from './Delivery/Delivery'
import { About } from './About/About'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductList } from './ProductList/ProductList'
import { useEffect, useState } from 'react'
import { ProductDetail } from './ProductDetail/ProductDetail'
import { AddProduct } from './AddProduct/AddProduct'
import { Checkout } from './Checkout/Checkout'
import eshop from './class/eshopFeClass'
import { Registration } from './Registration/Registration'



function App() {

  const [cart, setCart] = useState<CartItem[]>([]); // inicialize with empty array

  const [products, setProducts] = useState<Product[]>([]);

  const [activeCategory, setActiveCategory] = useState<'servers' | 'graphicCards' | 'cables' | 'utilities' | 'drones'>('servers')
  


  useEffect(() => {

    const loadProductsDb = async () => {

      const productsFromDb = await eshop.getProducts();
      
      setProducts(productsFromDb)

    }

    
    loadProductsDb()

    
  }, [])


  return (
    <>
      <div>
        <BrowserRouter>
          <Layout cart={cart} setCart={setCart} products={products} activeCategory={activeCategory} setActiveCategory={setActiveCategory}>
            {/* TOHLE VŠECHNO JE CHILDREN PROP PRO LAYOUT*/}
            <Routes>
              <Route path="/products" element={<ProductList setCart={setCart} cart={cart} products={products} activeCategory={activeCategory} />} />
              <Route path='/products/:id' element={<ProductDetail setCart={setCart} cart={cart} />} />
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/delivery" element={<Delivery />} />
              <Route path='/admin' element={<AddProduct products={products} />} />
              <Route path='/checkout' element={<Checkout setCart={setCart} cart={cart} />} />
              <Route path='/registration' element={<Registration/>} />

            </Routes>
            {/* ZDE KONČÍ CHILDREN PROP PRO LAYOUT*/}
          </Layout>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
