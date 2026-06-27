import { useEffect, useState } from "react";
import api from "../../api/axios";
import { uploadImage } from "../../api/upload";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fields, setFields] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  // Ad-hoc input states for the custom field manager inside the form
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const [form, setForm] = useState({
    productName: "",
    description: "",
    categoryId: "",
    images: [],
    customFields: {},
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFields();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchFields = async () => {
    try {
      const res = await api.get("/fields");
      setFields(res.data.fields || []);
    } catch (err) {
      console.error("Failed to fetch custom fields", err);
    }
  };

  // Dynamic Manager: Adds a clean key/value configuration to the form payload
  const addAdHocField = (e) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    setForm((prev) => ({
      ...prev,
      customFields: {
        ...prev.customFields,
        [newKey.trim()]: newValue.trim(),
      },
    }));

    setNewKey("");
    setNewValue("");
  };

  // Dynamic Manager: Removes a configuration row from the active form object
  const removeAdHocField = (keyToRemove) => {
    setForm((prev) => {
      const updatedFields = { ...prev.customFields };
      delete updatedFields[keyToRemove];
      return { ...prev, customFields: updatedFields };
    });
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const urls = [];
      for (const file of files) {
        const url = await uploadImage(file);
        urls.push(url);
      }

      setForm((prev) => {
        const updatedImages = [...prev.images, ...urls];
        setPreviewImages(updatedImages);
        return { ...prev, images: updatedImages };
      });
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", form);
      
      setForm({
        productName: "",
        description: "",
        categoryId: "",
        images: [],
        customFields: {},
      });
      setPreviewImages([]); 
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen antialiased font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 tracking-tight">Products Management</h1>

      {/* Product Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-sm border border-gray-100 rounded-xl p-5 sm:p-6 mb-8 max-w-3xl w-full">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Product</h2>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={form.productName}
            onChange={(e) => setForm({ ...form, productName: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24 resize-none"
          />

          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* ================= CUSTOM FIELDS SECTION ================= */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 my-5">
          <h3 className="text-sm font-bold text-gray-800 mb-0.5">Custom Specifications</h3>
          <p className="text-xs text-gray-500 mb-4">Add unique dynamic parameters to help buyers order over WhatsApp.</p>

          {/* A. System Loaded Global Fields Loops */}
          <div className="space-y-3">
            {fields.map((field) => (
              <div key={field._id}>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{field.fieldName}</label>
                <input
                  type="text"
                  placeholder={`Enter ${field.fieldName}`}
                  value={form.customFields[field.fieldName] || ""}
                  className="w-full px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      customFields: {
                        ...form.customFields,
                        [field.fieldName]: e.target.value,
                      },
                    })
                  }
                />
              </div>
            ))}
          </div>

          {/* B. Render Currently Configured Ad-Hoc Fields and Added Keys */}
          {Object.keys(form.customFields).length > 0 && (
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Technical Tags:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(form.customFields).map(([key, value]) => {
                  const isSystemField = fields.some(f => f.fieldName === key);
                  if (isSystemField && value) return null; 
                  if (!value) return null;

                  return (
                    <div key={key} className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs">
                      <span className="text-xs font-medium text-gray-700 truncate mr-2">
                        <strong className="text-gray-900 font-semibold">{key}:</strong> {value}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAdHocField(key)}
                        className="text-gray-400 hover:text-red-500 text-xs font-bold p-0.5 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* C. Dynamic Row Creator Elements */}
          <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-dashed border-gray-200">
            <input
              type="text"
              placeholder="Label (e.g., Fabric)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 border bg-white px-3 py-2 border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Value (e.g., Silk)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 border bg-white px-3 py-2 border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={addAdHocField}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
            >
              + Add Row
            </button>
          </div>
        </div>
        {/* ======================================================== */}

        {/* Media Upload Layout */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
          />
          {uploading && <p className="text-blue-600 text-xs mt-2 animate-pulse font-medium">Uploading asset files...</p>}
        </div>

        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-5 bg-gray-50 p-3 rounded-xl border border-gray-200">
            {previewImages.map((img, index) => (
              <div key={index} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 bg-white shadow-xs">
                <img
                  src={img}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <button className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm w-full sm:w-auto text-sm text-center">
          Save Product
        </button>
      </form>

      {/* Clean Grid View for Catalog Items */}
      <h2 className="text-xl font-bold mb-5 text-gray-800">Active Catalog Items</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-xs overflow-hidden flex flex-col justify-between border border-gray-100 transition hover:shadow-md">
            <div>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-48 sm:h-52 object-cover bg-gray-100"
                />
              ) : (
                <div className="w-full h-48 sm:h-52 bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium">
                  No Image Available
                </div>
              )}

              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h2 className="font-bold text-base sm:text-lg text-gray-900 leading-tight truncate">{product.productName}</h2>
                  <span className="text-[11px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                    Views: {product.views || 0}
                  </span>
                </div>
                
                <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2">{product.description || "No description provided."}</p>

                {Object.keys(product.customFields || {}).length > 0 && (
                  <div className="border-t border-gray-100 pt-3 space-y-1.5 bg-gray-50/70 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 p-4 sm:p-5">
                    {Object.entries(product.customFields).map(([key, value]) => (
                      <p key={key} className="text-xs text-gray-600 truncate">
                        <strong className="text-gray-500 font-medium uppercase tracking-wider text-[10px] block mb-0.5">{key}</strong> 
                        <span className="text-gray-800 font-medium">{value}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => deleteProduct(product._id)}
                className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors p-1"
              >
                Delete Asset
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
