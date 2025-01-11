import './Aside.css'
export function Aside() {
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

            <div className="payment-methods">
                <p>We are accepting</p>
                <img src='/images/payments.png'></img>
            </div>
        </aside>
    );
}