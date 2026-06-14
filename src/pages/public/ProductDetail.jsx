import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; // <-- 1. Import Helmet
import api from "../../api/axios";


export default function ProductDetail() {
  const { storeSlug, productSlug } = useParams();

  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const productUrl = window.location.href;

  // Handles both target product and its related items in a single lifecycle call
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        // 1. Fetch Target Product Details
        const res = await api.get(`/public/store/${storeSlug}/product/${productSlug}`);
        setData(res.data);

        if (res.data.product?.images?.length) {
          setSelectedImage(res.data.product.images[0]);
        }

        // 2. Fetch Related Items
        const relatedRes = await api.get(`/public/store/${storeSlug}/product/${productSlug}/related`);
        setRelatedProducts(relatedRes.data.relatedProducts || []);
      } catch (error) {
        console.error("Error loading product detail data:", error);
      }
    };

    fetchProductAndRelated();
  }, [storeSlug, productSlug]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 animate-pulse font-medium">Loading asset details...</p>
      </div>
    );
  }

  const { store, product } = data;



  // Safe string assembly for external integrations
  const whatsappMessage = `Hello, I am interested in: ${product.productName}. Please share more details.\nLink: ${productUrl}`;
  const whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const shareUrl =
  `https://ecommerce-saas-backend.onrender.com/share/product/${storeSlug}/${productSlug}`;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      {/* 2. Inject Dynamic Metadata for Facebook & Social Share Systems */}
      <Helmet>
        <title>{product.productName} | {store.storeName || "Store"}</title>
         <meta property="og:type" content="product" />
  <meta property="og:title" content={product.productName} />
  <meta property="og:description" content={product.description || ""} />
  <meta property="og:image" content={selectedImage} />
  <meta property="og:url" content={productUrl} />

  <meta property="og:site_name" content={store.storeName} />

  <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={product.productName} />
  <meta name="twitter:description" content={product.description || ""} />
  <meta name="twitter:image" content={selectedImage} />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Breadcrumb Nav */}
        <div className="mb-6">
          <Link to={`/store/${storeSlug}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
            &larr; Back to {store.storeName || "Store"}
          </Link>
        </div>

        {/* Product Media & Spec Layout Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12">
          
          {/* Left Column: Visual Media Asset Manager */}
          <div>
            <div className="w-full h-112.5 md:h-125 rounded-xl overflow-hidden bg-gray-100 border">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="w-full h-full object-cover transition duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Selection Bar */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-gray-50 shrink-0 transition-all ${
                      selectedImage === img ? "border-blue-600 shadow-sm" : "border-gray-200 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Descriptions & Action Flow Panels */}
          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.productName}</h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6 whitespace-pre-line">
                {product.description || "No product description provided."}
              </p>

              {/* Specifications Block Table */}
              {Object.keys(product.customFields || {}).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 divide-y divide-gray-200">
                    {Object.entries(product.customFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2.5 text-sm">
                        <span className="text-gray-500 font-medium">{key}</span>
                        <span className="text-gray-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Interaction Row */}
            <div className="border-t pt-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3.5 rounded-xl transition shadow-sm inline-flex justify-center items-center gap-2 mb-6"
              >
                <span>Send WhatsApp Inquiry</span>
              </a>

              {/* Social Directory Links Share Tray */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Share this Collection</h4>
                <div className="flex flex-wrap gap-2">
                  <a
      href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noreferrer"
      className="px-4 py-2 bg-gray-100 hover:bg-green-50 text-gray-700 hover:text-green-700 border rounded-lg text-xs font-medium transition"
    >
      WhatsApp
    </a>
                  <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noreferrer"
      className="px-4 py-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 border rounded-lg text-xs font-medium transition"
    >
      Facebook
    </a>
                  <a
      href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
      target="_blank"
      rel="noreferrer"
      className="px-4 py-2 bg-gray-100 hover:bg-sky-50 text-gray-700 hover:text-sky-700 border rounded-lg text-xs font-medium transition"
    >
      Telegram
    </a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Contextual Recommendations Carousel Section */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/store/${storeSlug}/product/${item.slug}`}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 bg-gray-100 overflow-hidden relative">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image Available
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.productName}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <span className="inline-block w-full text-center bg-gray-50 border text-gray-600 text-xs font-medium py-1.5 rounded-md transition group-hover:bg-blue-50 group-hover:text-blue-700">
                      View Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}