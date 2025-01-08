import React from "react"
import { Header } from "../Header/Header"
import { Footer } from "../Footer/Footer"

interface LayoutProps {
    children: React.ReactNode
}

// layout jurčuje strukturu celé stránky a exportujeme ho do app


export function Layout({children}: LayoutProps) { // children je speciální prop v Reactu, který představuje veškerý obsah mezi otevíracím a zavíracím tagem komponenty. V našem případě díky children. propu můžeme do Layoutu (mezi Header a Footer) vložit různé stránky pomocí React Routeru. Layoutu předávám props tím, že je to všechno co je v App.tsx mezi tagy <Layout></Layout> Je to jako byste řekli:

    //Layout je šablona stránky (header, main, footer)
    //V main části je placeholder {children}
    //A do toho placeholderu se vloží cokoliv, co dáte mezi <Layout> tagy
    //V našem případě tam dáváme Routes, které řídí, jaká komponenta se tam má vložit podle URL
    
    return (

        <div>
        <Header/>
        <main>
            {children} {/**toto se bude měnit podle toho na jakou routu klikne uživatel v */}
        </main>
        <Footer/>
    </div>

    )
}