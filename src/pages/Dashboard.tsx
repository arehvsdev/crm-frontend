import { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import { useToast } from "../context/ToastContext";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

function Dashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    // Load user profile from localStorage
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user profile", e);
      }
    }

    // Load customer counts
    const loadStats = async () => {
      try {
        const customers = await getCustomers();
        setCustomerCount(customers.length);
      } catch (err: any) {
        showToast("Failed to fetch customer metrics", "error");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const role = user?.role || "User";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Overview of your CRM workspace and account activity.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Simple Welcome Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Welcome Back</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">{user?.name || "User"}</h2>
            <p className="text-slate-500 text-sm mt-1">{user?.email || "No email provided"}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Account Role</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              role === "Admin"
                ? "bg-rose-50 text-rose-600 border border-rose-100"
                : "bg-indigo-50 text-indigo-600 border border-indigo-100"
            }`}>
              {role}
            </span>
          </div>
        </div>

        {/* Dynamic Metric Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {role === "Admin" ? "System Overview" : "Your Metrics"}
            </span>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              {role === "Admin" ? "Global Customers" : "Created Customers"}
            </h3>
            <p className="text-slate-500 text-xs mt-1">
              {role === "Admin" 
                ? "Total number of customers registered across the entire system."
                : "Total number of customers you have created and own."
              }
            </p>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            {loading ? (
              <div className="h-10 w-16 bg-slate-100 rounded-lg animate-pulse" />
            ) : (
              <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                {customerCount}
              </span>
            )}
            <span className="text-slate-400 text-sm font-semibold">customers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;