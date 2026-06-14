import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import api from "../../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate(); // 2. Initialize navigate

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/dashboard");
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  // 3. Handle clearing token and redirecting to login page
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      {/* 4. Added Top Header Bar with Logout button */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded transition-colors shadow-sm"
        >
          Logout
        </button>
      </div>

      {/* Grid Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded">
          <span className="text-gray-500 font-medium">Products</span>
          <h2 className="text-2xl font-bold mt-1">{data.totalProducts}</h2>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <span className="text-gray-500 font-medium">Categories</span>
          <h2 className="text-2xl font-bold mt-1">{data.totalCategories}</h2>
        </div>

        <div className="bg-white shadow p-4 rounded">
          <span className="text-gray-500 font-medium">Views</span>
          <h2 className="text-2xl font-bold mt-1">{data.totalViews}</h2>
        </div>
      </div>
    </div>
  );
}