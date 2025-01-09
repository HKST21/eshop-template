export function Aside() {
    return (
        <aside className="fixed top-0 right-0 h-screen bg-gray-100 p-4 w-64 border-l border-gray-200">
            <div className="mb-4 pt-4">
                <h3 className="text-lg font-semibold text-gray-700 pl-2">Categories</h3>
            </div>
            <ul className="space-y-3">
                <li className="text-gray-700 transition hover:text-gray-700/75 cursor-pointer pl-2">
                    Servers
                </li>
                <li className="text-gray-700 transition hover:text-gray-700/75 cursor-pointer pl-2">
                    Graphic cards
                </li>
                <li className="text-gray-700 transition hover:text-gray-700/75 cursor-pointer pl-2">
                    Cables
                </li>
                <li className="text-gray-700 transition hover:text-gray-700/75 cursor-pointer pl-2">
                    Utilities
                </li>
                <li className="text-gray-700 transition hover:text-gray-700/75 cursor-pointer pl-2">
                    Drones
                </li>
            </ul>
        </aside>
    );
}