import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function StoreHome() {
  const { storeSlug } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Interactive category tracking

  useEffect(() => {
    fetchStore();
  }, [storeSlug]);

  const fetchStore = async () => {
    try {
      const res = await api.get(`/public/store/${storeSlug}`);
      setStoreData(res.data);
    } catch (error) {
      console.error("Error fetching storefront data:", error);
    }
  };

  if (!storeData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse font-medium">Loading storefront...</p>
      </div>
    );
  }

  const { store, categories, products } = storeData;

  // Filter products by BOTH search text and selected category button click
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Banner */}
      {store.banner ? (
        <img
          src={store.banner}
          alt={`${store.storeName} Banner`}
          className="w-full h-64 md:h-80 object-cover shadow-sm"
        />
      ) : (
        <div className="w-full h-32 bg-slate-800" />
      )}

      {/* Main Container Wrapper to keep items centered */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Store Brand Header */}
        <div className="flex flex-col sm:flex-row items-center gap-5 -mt-12 mb-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {store.logo ? (
            <img
              src={store.logo}
              alt={`${store.storeName} Logo`}
              className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-md">
              {store.storeName?.charAt(0)}
            </div>
          )}

          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{store.storeName}</h1>
            <p className="text-gray-500 text-sm mb-3">{store.address || "Surat, Gujarat"}</p>
            <a
              href={`https://wa.me/${store.whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors gap-2 shadow-sm"
            >
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>

        {/* Interactive Categories Segment */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">Browse Categories</h2>
          <div className="flex gap-2 flex-wrap items-center">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                selectedCategory === null
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              All Items
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedCategory === cat._id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar & Section Title Grid Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Our Collections</h2>
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search fabrics, products..."
              className="w-full border border-gray-300 bg-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filtered Grid Catalog Output */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product._id}
                to={`/store/${storeSlug}/product/${product.slug}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="overflow-hidden bg-gray-100 h-64 relative">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.productName}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                        No Image Available
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {product.productName}
                    </h3>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {product.description || "Click to see catalog specifications."}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <span className="inline-block w-full text-center bg-gray-50 group-hover:bg-blue-50 border text-gray-600 group-hover:text-blue-700 text-xs font-semibold py-2 rounded-md transition">
                    View Details
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-12 text-center shadow-sm">
            <p className="text-gray-500 font-medium">No products found matching filters.</p>
            <p className="text-gray-400 text-xs mt-1">Try typing a different name or picking a different category tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}