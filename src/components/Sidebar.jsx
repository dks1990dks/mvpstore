import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen">
      <h1 className="text-xl p-4">My Store</h1>

      <ul>
        <li>
          <Link to="/dashboard" className="block p-4">
            Dashboard
          </Link>
        </li>

        <li>
          <Link to="/categories" className="block p-4">
            Categories
          </Link>
        </li>

        <li>
          <Link to="/products" className="block p-4">
            Products
          </Link>
        </li>

        <li>
          <Link to="/store-settings" className="block p-4">
            Store Settings
          </Link>
        </li>
      </ul>
    </div>
  );
}
