import { useState, useEffect } from 'react';
import './Aside.css'
import { Product } from '../types/types';
import { Link } from 'react-router-dom';

interface AsideProps {
    products: Product[]
}
export function Aside({ products }: AsideProps) {

    const [textToSearch, setTextToSearch] = useState<string>("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [interactivePlaceholder, setInteractivePlaceholder] = useState<string>("...")


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
    return (
        <aside className="categories-aside">
            <h2>Categories</h2>
            <ul>
                <li>Servers</li>
                <li>Graphic cards</li>
                <li>Cables</li>
                <li>Utilities</li>
                <li>Drones</li>
            </ul>
            <div>
                <input
                    placeholder={interactivePlaceholder}
                    onBlur={() => setInteractivePlaceholder('...')}
                    onFocus={handleOnFocus}
                    onChange={handleOnChange}
                    value={textToSearch}
                ></input>
                {textToSearch && filteredProducts?.map((filteredProduct) => (
                    <div className='searched-product'  key={filteredProduct.id}>
                        <Link to={`/products/${filteredProduct.id}`}>
                            {filteredProduct.name}
                        </Link>
                    </div>
                ))}
                {textToSearch && filteredProducts?.length === 0 && (
                    <div>no products</div>
                )}
            </div>

            <div className="payment-methods">
                <p>We are accepting</p>
                <img src='/images/payments.png'></img>
            </div>
        </aside>
    );
}