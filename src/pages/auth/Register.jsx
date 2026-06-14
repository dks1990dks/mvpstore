import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link for better navigation UX
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    storeName: "",
    whatsappNumber: "",
  });
  
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    
    try {
      const res = await api.post("/auth/register", form);
      
      // Successfully logs the user in and context handles state
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // Stop loading regardless of success/error
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white shadow-md p-6 rounded-lg"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
          Create Your Store Account
        </h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Owner Name"
          value={form.name} // Added missing value
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email Address"
          value={form.email} // Added missing value
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={form.password} // Added missing value
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        {/* Store Name Input */}
        <input
          type="text"
          placeholder="Store Name (e.g., Mahadev Textiles)"
          value={form.storeName}
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Added styling
          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
          required // Made required
        />

        {/* WhatsApp Number Input */}
        <input
          type="tel" // Changed to tel type for mobile semantic correctness
          placeholder="WhatsApp Number (with country code)"
          value={form.whatsappNumber}
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" // Added styling
          onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
          required // Made required
        />

        {/* Submit Button with Loading Indicator */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white px-4 py-2 rounded transition ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Store..." : "Register & Launch Store"}
        </button>

        {/* Helpful navigation redirect link */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}