import { useState, useEffect } from 'react';
import './Aside.css'
import { Product } from '../types/types';
import { Link } from 'react-router-dom';

interface AsideProps {
    products: Product[],
    activeCategory: 'servers' | 'graphicCards' | 'cables' | 'utilities' | 'drones',
    setActiveCategory: React.Dispatch<React.SetStateAction<'servers' | 'graphicCards' | 'cables' | 'utilities' | 'drones'>>
}
export function Aside({ products, activeCategory, setActiveCategory }: AsideProps) {

    const [textToSearch, setTextToSearch] = useState<string>("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [interactivePlaceholder, setInteractivePlaceholder] = useState<string>("...");
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [typedPass, setTypedPass] = useState(""); // TODO
    const [passErr, setPassErr] = useState("")



    const handleOnFocus = () => {
        console.log("focused on input")
        setInteractivePlaceholder('type product to search')
    }



    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const userTyping = e.target.value;

        setTextToSearch(userTyping);

        console.log("User typed", userTyping)

        if (products) {

            const filteredArray = products.filter((product) => product.name.toLocaleLowerCase().includes(userTyping.toLocaleLowerCase()));

            setFilteredProducts(filteredArray)

            console.log("FilteredArray", filteredArray)

        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {

        if (e.key === "Escape") {
            setTextToSearch("")
        }
        if (e.key === "ArrowDown") {
            setActiveIndex(prev => Math.min(prev + 1, filteredProducts.length - 1)) // prev představuje předchozí hodnotu, kdy ji náhrazujeme hodnoutou za =>, kde čekáme zda Math.min vybere menší číslo ze dvou v argumentu. Je to důležité protože nemůžeme jít přes velikost pole.
        }

        if (e.key === "ArrowUp") {
            setActiveIndex(prev => Math.max(prev - 1, 0))
        }

        if (activeIndex < 0) {
            setActiveIndex(0)
        }

        console.log(activeIndex)

    }

    const handleLogin = () => {
        console.log("I want login")
    }

    const handleOnKeyUpPass = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const typingPass = e.currentTarget.value;

        if (typingPass.length < 6) {
            setPassErr("password has to be at least 6 characters")
        }
        else {
            setPassErr("")
        }

       
    }



    return (
        <aside className="categories-aside">
            <h2>Categories</h2>
            <ul>
                <li onClick={() => setActiveCategory('servers')}>Servers</li>
                <li onClick={() => setActiveCategory('graphicCards')}>Graphic cards</li>
                <li onClick={() => setActiveCategory('cables')}>Cables</li>
                <li onClick={() => setActiveCategory('utilities')}>Utilities</li>
                <li onClick={() => setActiveCategory('drones')}>Drones</li>
            </ul>
            <div>
                <h4>SEARCH PRODUCTS</h4>
                <input
                    placeholder={interactivePlaceholder}
                    onBlur={() => setInteractivePlaceholder('...')}
                    onFocus={handleOnFocus}
                    onChange={handleOnChange}
                    value={textToSearch}
                    onKeyDown={handleKeyDown}
                ></input>
                {textToSearch && filteredProducts?.map((filteredProduct, index) => (
                <div className="searched-product"
                key={filteredProduct.id}>
                        <Link to={`/products/${filteredProduct.id}`}
                        className={index === activeIndex ? "highlighted-search-result" : ""}>
                            {filteredProduct.name}
                        </Link>
                </div>
                ))}
                {textToSearch && filteredProducts?.length === 0 && (
                    <div>no products</div>
                )}
            </div>
            <br/>
            <div>
                <h4>login</h4>
                <form>
                <input
                placeholder='email'
                type='email'>
                </input>
                <input
                onKeyUp={handleOnKeyUpPass}
                onBlur={() => setPassErr("")}
                placeholder='password'
                type='password'
                >
                </input>
                {passErr}
                <button onClick={handleLogin}>LOGIN</button>
                </form>
            </div>
            <div>
                <Link to={'/registration'} >No account? Register with us</Link>
            </div>

            <div className="payment-methods">
                <p>We are accepting</p>
                <img src='/images/payments.png'></img>
            </div>
        </aside>
    );
}