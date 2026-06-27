import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch categories", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      await api.post("/categories", { name: name.trim() });
      setName("");
      await fetchCategories();
    } catch (err) {
      console.error("Failed to add category", err);
      alert("Error adding category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    
    try {
      await api.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error("Failed to delete category", err);
      alert("Error deleting category. It might be linked to existing products.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto antialiased font-sans">
      {/* Title Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight">
        Categories
      </h1>

      {/* Creation Form Section */}
      <form onSubmit={addCategory} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Electronics, Clothing"
          disabled={submitting}
          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all disabled:bg-gray-100 text-sm sm:text-base"
        />
        <button 
          type="submit" 
          disabled={submitting || !name.trim()}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm text-sm sm:text-base text-center"
        >
          {submitting ? "Adding..." : "Add Category"}
        </button>
      </form>

      {/* Main Content Area */}
      {loading ? (
        /* Animated Skeleton Loading State */
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      ) : error ? (
        /* Error Display Box */
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm">
          <p className="mb-2 font-medium">{error}</p>
          <button onClick={fetchCategories} className="underline font-semibold hover:text-red-900">
            Retry Loading
          </button>
        </div>
      ) : categories.length === 0 ? (
        /* Empty State Graphic/Notice */
        <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-sm">
          <p className="text-gray-500 text-sm sm:text-base">No categories created yet.</p>
        </div>
      ) : (
        /* Responsive Content Representation (Clean Stack on Mobile, Grid/List layout) */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className="flex items-center justify-between p-4 sm:px-6 hover:bg-gray-50 transition-colors gap-4"
              >
                <span className="font-medium text-gray-800 text-sm sm:text-base truncate">
                  {cat.name}
                </span>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-sm font-medium text-red-600 hover:text-red-800 hover:underline transition-colors focus:outline-none p-1 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
