import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setData(res.data);
      setError(null);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
      setError("Failed to load dashboard statistics.");
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fully Responsive Skeleton Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b border-gray-200 pb-4">
          <div className="h-8 w-40 bg-gray-200 rounded-md"></div>
          <div className="h-10 w-24 bg-gray-200 rounded-md self-end sm:self-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-28"></div>
          ))}
        </div>
      </div>
    );
  }

  // Responsive Error Screen
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center max-w-sm w-full mx-auto">
          <p className="text-red-600 font-medium mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={fetchDashboard}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 antialiased font-sans">
      {/* Top Header Bar - Shifts elegantly from layout rows on mobile to aligned columns on desktop */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 sm:py-2 rounded-lg transition-colors shadow-sm text-sm text-center"
        >
          Logout
        </button>
      </div>

      {/* Grid Stats Grid - 1 Column on Mobile, 2 Columns on Tablets, 3 Columns on Desktops */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Products Card */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <span className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">Products</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{data?.totalProducts ?? 0}</h2>
        </div>

        {/* Categories Card */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <span className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">Categories</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{data?.totalCategories ?? 0}</h2>
        </div>

        {/* Views Card - spans full screen width on smaller sizes for symmetrical UI balance */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md sm:col-span-2 md:col-span-1">
          <span className="text-xs sm:text-sm text-gray-500 font-medium uppercase tracking-wider">Total Views</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mt-2">{data?.totalViews ?? 0}</h2>
        </div>
      </div>
    </div>
  );
}
