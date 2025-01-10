import './Aside.css'
export function Aside() {
    return (
        <aside>
            <div>
                <h3 className='menu'>Categories</h3>
            </div>
            <ul className="menu">
                <li>
                    Servers
                </li>
                <li>
                    Graphic cards
                </li>
                <li>
                    Cables
                </li>
                <li>
                    Utilities
                </li>
                <li>
                    Drones
                </li>
            </ul>
        </aside>
    );
}