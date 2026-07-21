import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm"
        : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/30 border border-transparent"
    }`;

  const role = user?.role || "User";

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40 backdrop-blur-md bg-white/95">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-all">
                C
              </div>
              <span className="font-extrabold text-lg text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                CRM - APP
              </span>
            </Link>

            {/* Navigation links */}
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link to="/customers" className={navLinkClass("/customers")}>
                Customers
              </Link>
            </div>
          </div>

          {/* User profile / Logout */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-right hidden sm:flex">
              <span className="text-sm font-bold text-slate-800 leading-none">{user?.name || "User"}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 uppercase tracking-wider ${
                role === "Admin"
                  ? "bg-rose-50 text-rose-600 border border-rose-200/50"
                  : "bg-slate-50 text-slate-500 border border-slate-200/50"
              }`}>
                {role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;