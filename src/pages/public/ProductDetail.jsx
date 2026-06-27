import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async"; 
import api from "../../api/axios";

export default function ProductDetail() {
  const { storeSlug, productSlug } = useParams();

  const [data, setData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);

  const productUrl = window.location.href;

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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500 animate-pulse font-medium tracking-wide">Loading masterpiece details...</p>
      </div>
    );
  }

  const { store, product } = data;

  // Safe string assembly for external integrations
  const whatsappMessage = `Hello, I am interested in: ${product.productName}. Please share more details.\nLink: ${productUrl}`;
  const whatsappLink = `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  // Use backend share preview URL so social crawlers receive meta tags reliably
  const shareUrl = `https://ecommerce-saas-backend.onrender.com/share/product/${storeSlug}/${productSlug}`;

  return (
    <div className="bg-neutral-50 min-h-screen py-10 font-sans">
      <Helmet>
        <title>{product.productName} | {store.storeName || "Boutique"}</title>
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
        <div className="mb-8">
          <Link to={`/store/${storeSlug}`} className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-amber-600 hover:text-amber-700 transition gap-1.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to {store.storeName || "Collection"}
          </Link>
        </div>

        {/* Product Media & Spec Layout Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 bg-white p-5 md:p-8 rounded-2xl shadow-xl shadow-neutral-200/40 border border-neutral-100 mb-16">

          {/* Left Column: Visual Media Asset Manager */}
          <div>
            <div className="w-full aspect-[3/4] md:h-[550px] rounded-xl overflow-hidden bg-neutral-50 border border-neutral-100 relative">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt={product.productName}
                  className="w-full h-full object-cover transition duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm tracking-wider uppercase">
                  No Image Available
                </div>
              )}
            </div>

            {/* Thumbnail Selection Bar */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-24 rounded-lg overflow-hidden border-2 bg-neutral-50 flex-shrink-0 transition-all ${
                      selectedImage === img 
                        ? "border-amber-600 shadow-md shadow-amber-600/10 scale-95" 
                        : "border-neutral-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Descriptions & Action Flow Panels */}
          <div className="flex flex-col justify-between py-2">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-amber-600">Exclusive Piece</span>
              <h1 className="text-3xl font-serif font-bold text-neutral-900 mt-1 mb-4 leading-tight">{product.productName}</h1>
              
              <div className="h-px bg-neutral-100 w-full my-4" />
              
              <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-8 whitespace-pre-line font-normal">
                {product.description || "No product specification text provided."}
              </p>

              {/* Specifications Block Table */}
              {Object.keys(product.customFields || {}).length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">Specifications</h3>
                  <div className="bg-neutral-50 rounded-xl border border-neutral-150 p-4 divide-y divide-neutral-200/70">
                    {Object.entries(product.customFields).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 text-sm">
                        <span className="text-neutral-500 font-medium">{key}</span>
                        <span className="text-neutral-900 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* CTA Interaction Row */}
            <div className="border-t border-neutral-150 pt-6">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-6 py-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-100 inline-flex justify-center items-center gap-2 mb-6 tracking-wide uppercase"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397 0 11.966 0c3.178.001 6.167 1.24 8.414 3.491 2.246 2.25 3.481 5.244 3.48 8.419-.003 6.616-5.339 11.964-11.907 11.964-2.003-.001-3.973-.504-5.714-1.463L0 24zm6.549-2.581c1.559.925 3.125 1.414 4.861 1.416 5.4 0 9.796-4.378 9.798-9.761.002-2.607-1.01-5.059-2.852-6.905C16.52 4.316 14.084 3.3 11.499 3.3 6.1 3.3 1.704 7.681 1.702 13.062c-.001 1.83.48 3.61 1.392 5.161l-.971 3.551 3.634-.953z"/></svg>
                <span>Send WhatsApp Inquiry</span>
              </a>

              {/* Social Directory Links Share Tray */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-3">
                  Share this Masterpiece
                </h4>

                <div className="flex flex-wrap gap-2">
                  {/* WhatsApp Share */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-neutral-50 hover:bg-emerald-50 text-neutral-600 hover:text-emerald-700 border border-neutral-200 hover:border-emerald-200 rounded-xl text-xs font-semibold tracking-wide uppercase transition duration-150"
                  >
                    WhatsApp
                  </a>

                  {/* Facebook Share */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-neutral-50 hover:bg-blue-50 text-neutral-600 hover:text-blue-700 border border-neutral-200 hover:border-blue-200 rounded-xl text-xs font-semibold tracking-wide uppercase transition duration-150"
                  >
                    Facebook
                  </a>

                  {/* Telegram Share */}
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-neutral-50 hover:bg-sky-50 text-neutral-600 hover:text-sky-700 border border-neutral-200 hover:border-sky-200 rounded-xl text-xs font-semibold tracking-wide uppercase transition duration-150"
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
            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6 pb-3 border-b border-neutral-200">Related Masterpieces</h2>
            {/* Standardized to 2 columns on mobile device frames */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((item) => (
                <Link
                  key={item._id}
                  to={`/store/${storeSlug}/product/${item.slug}`}
                  className="group bg-white border border-neutral-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[3/4] bg-neutral-50 overflow-hidden relative">
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.productName}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs tracking-wider uppercase">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <h3 className="font-medium text-neutral-800 text-xs md:text-sm group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight">
                        {item.productName}
                      </h3>
                    </div>
                  </div>
                  <div className="p-3 md:p-4 pt-0">
                    <span className="inline-block w-full text-center bg-neutral-50 border border-neutral-100 text-neutral-600 text-xs font-semibold py-2 rounded-xl transition duration-200 tracking-wide uppercase group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200">
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
