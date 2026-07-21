import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      showToast("Please enter a valid email address", "error");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Logged in successfully", "success");
      navigate("/dashboard");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          New User?{" "}
          <Link
            to="/register"
            className="text-blue-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;