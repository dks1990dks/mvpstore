import { useState, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong during login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
      {/* Container wrapper block */}
      <div className="w-full max-w-md bg-white shadow-md p-6 rounded-lg">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">Login</h2>

          <div className="mb-3">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email} // Controlled input mapping
              className="border p-2 w-full rounded focus:outline-blue-500 text-sm"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={form.password} // Controlled input mapping
              className="border p-2 w-full rounded focus:outline-blue-500 text-sm"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 w-full rounded transition text-sm"
          >
            Login
          </button>
        </form>

        {/* Clean, centralized registration redirection links */}
        <p className="mt-5 text-xs text-center text-gray-500">
          Don't have an account yet?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
}