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
   <div className="bg-neutral-50 min-h-screen pb-16 font-sans">
{/* Hero Banner */}
{/* Hero Banner */}
{store.banner ? (
  <div className="relative w-full h-auto max-h-64 md:max-h-96 bg-neutral-900 overflow-hidden">
    <img
      src={store.banner}
      alt={`${store.storeName} Banner`}
      className="w-full h-full object-contain mx-auto"
    />
    {/* Soft gradient overlay for premium look */}
    <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 to-transparent pointer-events-none" />
  </div>
) : (
  <div className="w-full h-40 bg-linear-to-r from-neutral-800 to-neutral-950" />
)}

  {/* Main Container Wrapper */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Store Brand Header */}
    <div className="flex flex-col sm:flex-row items-center gap-6 -mt-16 mb-12 bg-white p-6 md:p-8 rounded-2xl shadow-xl shadow-neutral-200/50 border border-neutral-100 relative z-10">
      {store.logo ? (
        <img
          src={store.logo}
          alt={`${store.storeName} Logo`}
          className="w-28 h-28 rounded-full border-4 border-white object-cover bg-white shadow-lg"
        />
      ) : (
        <div className="w-28 h-28 rounded-full border-4 border-white bg-linear-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white font-serif font-bold text-3xl shadow-lg">
          {store.storeName?.charAt(0)}
        </div>
      )}

      <div className="text-center sm:text-left flex-1">
        <span className="text-xs font-semibold tracking-widest uppercase text-amber-600">Exclusive Boutique</span>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mt-0.5 mb-1">{store.storeName}</h1>
        <p className="text-neutral-500 text-sm flex items-center justify-center sm:justify-start gap-1">
          <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          {store.address || "Surat, Gujarat"}
        </p>
      </div>

      <div className="w-full sm:w-auto">
        <a
          href={`https://wa.me/${store.whatsappNumber}`}
          target="_blank"
          rel="noreferrer"
          className="w-full inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-3 rounded-xl transition-all duration-200 gap-2 shadow-md hover:shadow-emerald-100 tracking-wide"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.966 0c3.178.001 6.167 1.24 8.414 3.491 2.246 2.25 3.481 5.244 3.48 8.419-.003 6.616-5.339 11.964-11.907 11.964-2.003-.001-3.973-.504-5.714-1.463L0 24zm6.549-2.581c1.559.925 3.125 1.414 4.861 1.416 5.4 0 9.796-4.378 9.798-9.761.002-2.607-1.01-5.059-2.852-6.905C16.52 4.316 14.084 3.3 11.499 3.3 6.1 3.3 1.704 7.681 1.702 13.062c-.001 1.83.48 3.61 1.392 5.161l-.971 3.551 3.634-.953z"/></svg>
          <span>Inquire on WhatsApp</span>
        </a>
      </div>
    </div>

    {/* Interactive Categories Segment */}
    <div className="mb-12">
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4">Browse Collections By Category</h2>
      <div className="flex gap-2.5 flex-wrap items-center">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
            selectedCategory === null
              ? "bg-neutral-900 text-white shadow-md shadow-neutral-900/20"
              : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === cat._id
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                : "bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50"
          }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>

    {/* Search Bar & Section Title Grid Toolbar */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
      <h2 className="text-2xl font-serif font-bold text-neutral-900">Our Masterpieces</h2>
      <div className="w-full md:w-80 relative">
        <input
          type="text"
          placeholder="Search sarees, lehengas..."
          className="w-full border border-neutral-300 bg-white pl-4 pr-10 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-sm transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="absolute right-3 top-3 text-neutral-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </span>
      </div>
    </div>

    {/* Filtered Grid Catalog Output */}
    {filteredProducts.length > 0 ? (
      // Changed to grid-cols-2 on mobile for stunning presentation of tall fashion images
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Link
            key={product._id}
            to={`/store/${storeSlug}/product/${product.slug}`}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border border-neutral-100 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Premium Image Container */}
              <div className="overflow-hidden bg-neutral-50 aspect-3/4 relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.productName}
                    className="h-full w-full object-cover group-hover:scale-102 transition duration-500"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs tracking-wider uppercase bg-neutral-100">
                    No Image
                  </div>
                )}
                {/* Elegant subtle hover overlay */}
                <div className="absolute inset-0 bg-neutral-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Text Area */}
              <div className="p-3 md:p-4">
                <h3 className="font-medium text-neutral-800 text-sm md:text-base leading-tight group-hover:text-amber-600 transition-colors line-clamp-2">
                  {product.productName}
                </h3>
                <p className="text-neutral-400 text-xs mt-1 font-normal line-clamp-1">
                  {product.description || "Premium Quality Fabric Collection"}
                </p>
              </div>
            </div>

            {/* View Details Action Button */}
            <div className="p-3 md:p-4 pt-0">
              <span className="inline-block w-full text-center bg-neutral-50 group-hover:bg-amber-50 border border-neutral-100 group-hover:border-amber-200 text-neutral-600 group-hover:text-amber-700 text-xs font-semibold py-2.5 rounded-xl transition duration-200 tracking-wide uppercase">
                View Details
              </span>
            </div>
          </Link>
        ))}
      </div>
    ) : (
      <div className="bg-white rounded-2xl border border-neutral-100 p-16 text-center shadow-sm">
        <p className="text-neutral-600 font-medium text-lg">No collections match your filters.</p>
        <p className="text-neutral-400 text-sm mt-1">Try clearing your search query or picking a different category tab.</p>
      </div>
    )}
  </div>
</div>
  );
}
