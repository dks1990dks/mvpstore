import { useEffect, useState } from "react";
import api from "../../api/axios";
import { uploadImage } from "../../api/upload";

export default function StoreSettings() {
  const [form, setForm] = useState({
    storeName: "",
    logo: "",
    banner: "",
    whatsappNumber: "",
    address: "",
  });

  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    try {
      setFetching(true);
      const res = await api.get("/store/me");
      // Fallback object structural normalization
      setForm(res.data.store || {
        storeName: "",
        logo: "",
        banner: "",
        whatsappNumber: "",
        address: "",
      });
    } catch (err) {
      console.error("Failed to fetch store settings", err);
    } finally {
      setFetching(false);
    }
  };

  const saveStore = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put("/store/me", form);
      alert("Store Updated Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update store settings");
    } finally {
      setLoading(false);
    }
  };

  const uploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        logo: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Logo upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadBanner = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({
        ...prev,
        banner: url,
      }));
    } catch (err) {
      console.error(err);
      alert("Banner upload failed");
    } finally {
      setUploadingBanner(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-md mb-6"></div>
        <div className="bg-white p-5 border border-gray-100 rounded-xl space-y-4 shadow-xs">
          <div className="h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
          <div className="h-20 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto antialiased font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 tracking-tight">Store Settings</h1>

      <form onSubmit={saveStore} className="bg-white p-5 sm:p-6 shadow-xs border border-gray-100 rounded-xl space-y-5">
        
        {/* Store Profile Fields */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Store Name</label>
          <input
            type="text"
            value={form.storeName}
            placeholder="e.g. My Awesome Boutique"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">WhatsApp Number</label>
          <input
            type="tel"
            value={form.whatsappNumber}
            placeholder="e.g. +1234567890"
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Business Address</label>
          <textarea
            value={form.address}
            placeholder="Enter physical shop address if applicable..."
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-24 resize-none"
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        {/* Brand Assets Elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          
          {/* Logo Field */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Logo</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={uploadLogo} 
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {uploadingLogo && <p className="text-blue-600 text-xs mt-1.5 animate-pulse font-medium">Uploading brand logo...</p>}
            </div>
            
            <div className="w-full h-24 bg-white rounded-lg border border-gray-200 mt-4 flex items-center justify-center p-2 overflow-hidden">
              {form.logo ? (
                <img
                  src={form.logo}
                  alt="Store Logo"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400 font-medium">No Logo Configured</span>
              )}
            </div>
          </div>

          {/* Banner Field */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Store Banner</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={uploadBanner} 
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
              {uploadingBanner && <p className="text-blue-600 text-xs mt-1.5 animate-pulse font-medium">Uploading catalog banner...</p>}
            </div>
            
            <div className="w-full h-24 bg-white rounded-lg border border-gray-200 mt-4 flex items-center justify-center p-2 overflow-hidden">
              {form.banner ? (
                <img
                  src={form.banner}
                  alt="Store Banner"
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400 font-medium">No Banner Configured</span>
              )}
            </div>
          </div>

        </div>

        {/* Submit Bar Action Button */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading || uploadingLogo || uploadingBanner}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-6 py-2.5 rounded-lg transition shadow-sm text-sm text-center"
          >
            {loading ? "Saving Parameters..." : "Save Store"}
          </button>
        </div>
      </form>
    </div>
  );
}
