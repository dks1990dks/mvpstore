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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Products Management</h1>

      {/* Product Creation Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Product</h2>
        
        <input
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          className="border p-2 w-full mb-3 rounded focus:outline-blue-500 text-sm"
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 w-full mb-3 rounded focus:outline-blue-500 h-20 text-sm"
        />

        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="border p-2 w-full mb-3 rounded focus:outline-blue-500 text-sm"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* ================= CUSTOM FIELDS SECTION ================= */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Custom Specifications</h3>
          <p className="text-xs text-gray-400 mb-3">Add unique dynamic parameters to help buyers order over WhatsApp.</p>

          {/* A. System Loaded Global Fields Loops */}
          {fields.map((field) => (
            <div key={field._id} className="mb-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">{field.fieldName}</label>
              <input
                placeholder={`Enter ${field.fieldName}`}
                value={form.customFields[field.fieldName] || ""}
                className="border bg-white p-2 w-full rounded focus:outline-blue-500 text-sm"
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

          {/* B. Render Currently Configured Ad-Hoc Fields and Added Keys */}
          {Object.keys(form.customFields).length > 0 && (
            <div className="mt-3 space-y-2 border-t pt-3">
              <p className="text-xs font-semibold text-gray-500">Active Technical Tags:</p>
              {Object.entries(form.customFields).map(([key, value]) => {
                // Skips visual clutter duplication if it belongs to system loops above
                const isSystemField = fields.some(f => f.fieldName === key);
                if (isSystemField && value) return null; 
                if (!value) return null;

                return (
                  <div key={key} className="flex justify-between items-center bg-white px-3 py-1.5 rounded border border-gray-200">
                    <span className="text-xs font-medium text-gray-700">
                      <strong className="text-gray-900">{key}:</strong> {value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAdHocField(key)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold px-1"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* C. Dynamic Row Creator Elements */}
          <div className="flex gap-2 mt-3 pt-3 border-t border-dashed">
            <input
              type="text"
              placeholder="Label (e.g., Fabric)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="flex-1 border bg-white p-2 rounded text-xs focus:outline-blue-500"
            />
            <input
              type="text"
              placeholder="Value (e.g., Silk)"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="flex-1 border bg-white p-2 rounded text-xs focus:outline-blue-500"
            />
            <button
              type="button"
              onClick={addAdHocField}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-xs font-medium transition whitespace-nowrap"
            >
              + Add Row
            </button>
          </div>
        </div>
        {/* ======================================================== */}

        {/* Media Upload Layout */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
          <input
            type="file"
            multiple
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {uploading && <p className="text-blue-600 text-xs mt-1 animate-pulse">Uploading asset files...</p>}
        </div>

        {previewImages.length > 0 && (
          <div className="grid grid-cols-5 gap-3 mb-4 bg-gray-50 p-3 rounded border">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="preview"
                className="w-full h-20 object-cover border rounded bg-white shadow-sm"
              />
            ))}
          </div>
        )}

        <button className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded hover:bg-blue-700 transition w-full md:w-auto text-sm">
          Save Product
        </button>
      </form>

      {/* Clean Grid View for Catalog Items */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Active Catalog Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between border border-gray-100">
            <div>
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-52 object-cover bg-gray-100"
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                  No Image Available
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="font-bold text-lg text-gray-800 leading-tight">{product.productName}</h2>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Views: {product.views || 0}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description || "No description provided."}</p>

                {Object.keys(product.customFields || {}).length > 0 && (
                  <div className="border-t pt-3 space-y-1 bg-gray-50 -mx-4 -mb-4 p-4">
                    {Object.entries(product.customFields).map(([key, value]) => (
                      <p key={key} className="text-xs text-gray-700">
                        <strong className="text-gray-500 font-medium uppercase tracking-wider">{key}:</strong> {value}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => deleteProduct(product._id)}
                className="text-sm font-medium text-red-600 hover:text-red-800 transition"
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