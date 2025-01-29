import React, { useEffect, useState } from "react"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"
import { Aside } from "../Aside/Aside"
import { CartItem, Product } from "../types/types"
import './Layout.css'

interface LayoutProps {
    children: React.ReactNode,
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
    products: Product[],
    activeCategory: 'servers' | 'graphicCards' | 'cables' | 'utilities' | 'drones',
    setActiveCategory: React.Dispatch<React.SetStateAction<'servers' | 'graphicCards' | 'cables' | 'utilities' | 'drones'>>
}

// layout jurčuje strukturu celé stránky a exportujeme ho do app


export function Layout({ children, cart, setCart, products, activeCategory, setActiveCategory }: LayoutProps) { // children je speciální prop v Reactu, který představuje veškerý obsah mezi otevíracím a zavíracím tagem komponenty. V našem případě díky children. propu můžeme do Layoutu (mezi Header a Footer) vložit různé stránky pomocí React Routeru. Layoutu předávám props tím, že je to všechno co je v App.tsx mezi tagy <Layout></Layout> Je to jako byste řekli:

    //Layout je šablona stránky (header, main, footer)
    //V main části je placeholder {children}
    //A do toho placeholderu se vloží cokoliv, co dáte mezi <Layout> tagy
    //V našem případě tam dáváme Routes, které řídí, jaká komponenta se tam má vložit podle URL

    const [stickyHeader, setStickyHeader] = useState<boolean>(false);


    useEffect(() => {

        const handleScroll = () => {

            const scrolledDistance = window.scrollY

            if (scrolledDistance > 100) {
                setStickyHeader(true)
            }
            else {
                setStickyHeader(false)
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    },[])

    return (


        

        <div className="Layout">
            <Header cart={cart} setCart={setCart} stickyHeader={stickyHeader} />
            <div className="main-container">
            <Aside products={products} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
                <main className="middle-content">
                    {children} {/**toto se bude měnit podle toho na jakou routu klikne uživatel v */}
                </main>
            </div>
            <Footer />

        </div>

    )
}