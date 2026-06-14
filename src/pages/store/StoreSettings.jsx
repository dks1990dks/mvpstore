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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStore();
  }, []);

  const fetchStore = async () => {
    const res = await api.get("/store/me");

    setForm(res.data.store);
  };

  const saveStore = async (e) => {
    e.preventDefault();

    setLoading(true);

    await api.put("/store/me", form);

    setLoading(false);

    alert("Store Updated");
  };

  const uploadLogo = async (e) => {
    const file = e.target.files[0];

    const url = await uploadImage(file);

    setForm({
      ...form,
      logo: url,
    });
  };

  const uploadBanner = async (e) => {
    const file = e.target.files[0];

    const url = await uploadImage(file);

    setForm({
      ...form,
      banner: url,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-5">Store Settings</h1>

      <form onSubmit={saveStore} className="bg-white p-5 shadow rounded">
        <input
          value={form.storeName}
          placeholder="Store Name"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              storeName: e.target.value,
            })
          }
        />

        <input
          value={form.whatsappNumber}
          placeholder="WhatsApp"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              whatsappNumber: e.target.value,
            })
          }
        />

        <textarea
          value={form.address}
          placeholder="Address"
          className="border p-2 w-full mb-3"
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value,
            })
          }
        />

        <div className="mb-4">
          <label>Logo</label>

          <input type="file" onChange={uploadLogo} />

          {form.logo && (
            <img
              src={form.logo}
              alt=""
              className="
              h-20
              mt-2"
            />
          )}
        </div>

        <div className="mb-4">
          <label>Banner</label>

          <input type="file" onChange={uploadBanner} />

          {form.banner && (
            <img
              src={form.banner}
              alt=""
              className="
              h-32
              mt-2
              w-full
              object-cover"
            />
          )}
        </div>

        <button
          disabled={loading}
          className="
          bg-blue-600
          text-white
          px-4
          py-2"
        >
          {loading ? "Saving..." : "Save Store"}
        </button>
      </form>
    </div>
  );
}
