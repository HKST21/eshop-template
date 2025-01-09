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
              <Route path='/products/:id' element={<ProductDetail/>} />
              <Route path="about" element ={<About/>} />
              <Route path="terms" element ={<Terms/>} />
              <Route path="delivery" element={<Delivery/>} />

            </Routes>
            {/* ZDE KONČÍ CHILDREN PROP PRO LAYOUT*/}
          </Layout>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
