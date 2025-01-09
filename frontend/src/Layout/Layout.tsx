import React from "react"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"
import { Aside } from "../Aside/Aside"
import { CartItem } from "../types/types"

interface LayoutProps {
    children: React.ReactNode,
    cart: CartItem[],
    setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}

// layout jurčuje strukturu celé stránky a exportujeme ho do app


export function Layout({ children, cart, setCart }: LayoutProps) { // children je speciální prop v Reactu, který představuje veškerý obsah mezi otevíracím a zavíracím tagem komponenty. V našem případě díky children. propu můžeme do Layoutu (mezi Header a Footer) vložit různé stránky pomocí React Routeru. Layoutu předávám props tím, že je to všechno co je v App.tsx mezi tagy <Layout></Layout> Je to jako byste řekli:

    //Layout je šablona stránky (header, main, footer)
    //V main části je placeholder {children}
    //A do toho placeholderu se vloží cokoliv, co dáte mezi <Layout> tagy
    //V našem případě tam dáváme Routes, které řídí, jaká komponenta se tam má vložit podle URL

    return (

        <div className="min-h-screen flex flex-col">
            <Header cart={cart} setCart={setCart} />
            <Aside />
            <div className="flex flex-1">
                <main className="flex-1">
                    {children} {/**toto se bude měnit podle toho na jakou routu klikne uživatel v */}
                </main>
            </div>
            <Footer />
        </div>

    )
}