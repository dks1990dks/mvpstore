import { useEffect, useState } from "react";

import api from "../../api/axios";

export default function Categories() {
  const [name, setName] = useState("");

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await api.get("/categories");

    setCategories(res.data.categories);
  };

  const addCategory = async () => {
    await api.post("/categories", { name });

    setName("");

    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);

    fetchCategories();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <div className="flex gap-2 mb-5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
          className="border p-2"
        />

        <button onClick={addCategory} className="bg-blue-600 text-white px-4">
          Add
        </button>
      </div>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>

              <td>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
