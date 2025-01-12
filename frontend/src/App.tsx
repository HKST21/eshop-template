import './index.css'
import { Layout } from './Layout/Layout'
import { CartItem } from './types/types'
import { Terms } from './Terms/Terms'
import { Delivery } from './Delivery/Delivery'
import { About } from './About/About'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProductList } from './ProductList/ProductList'
import { useState } from 'react'
import { ProductDetail } from './ProductDetail/ProductDetail'
import { AddProduct } from './AddProduct/AddProduct'
import { Checkout } from './Checkout/Checkout'



function App() {
  
  const [cart, setCart] = useState<CartItem[]>([]); // inicialize with empty array


  return (
    <>
      <div>
        <BrowserRouter>
        <Layout cart={cart} setCart={setCart}>
            {/* TOHLE VŠECHNO JE CHILDREN PROP PRO LAYOUT*/}
            <Routes>
              <Route path="/products" element={<ProductList setCart={setCart} cart={cart}/>} />
              <Route path='/products/:id' element={<ProductDetail setCart={setCart} cart={cart}/>} />
              <Route path="/about" element ={<About/>} />
              <Route path="/terms" element ={<Terms/>} />
              <Route path="/delivery" element={<Delivery/>} />
              <Route path='/admin' element={<AddProduct/>} />
              <Route path='/checkout' element={<Checkout setCart={setCart} cart={cart}/>} />

            </Routes>
            {/* ZDE KONČÍ CHILDREN PROP PRO LAYOUT*/}
          </Layout>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
