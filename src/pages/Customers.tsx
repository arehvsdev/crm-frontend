import { useState, useEffect } from "react";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer } from "../services/customerService";
import CustomerTable from "../components/CustomerTable";
import type { Customer } from "../components/CustomerTable";
import { useToast } from "../context/ToastContext";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  });

  const { showToast } = useToast();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to load customers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setEmailError("");
    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setEmailError("");
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      phone: customer.phone || "",
      company: customer.company || "",
      status: customer.status || "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    try {
      await deleteCustomer(customerToDelete);
      showToast("Customer deleted successfully", "success");
      loadCustomers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete customer", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "email") {
      setEmailError("");
    }
  };

  const handleEmailBlur = () => {
    if (!form.email) {
      setEmailError("Email is required");
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      showToast("Name, Email, and Phone are required", "error");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(form.phone)) {
      showToast("Please enter a valid phone number", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer._id, form);
        showToast("Customer updated successfully", "success");
      } else {
        await addCustomer(form);
        showToast("Customer added successfully", "success");
      }
      setIsModalOpen(false);
      loadCustomers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save customer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 animate-pulse">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            <div className="h-4 w-64 bg-slate-100 rounded mt-2" />
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 shadow-sm animate-pulse">
          <div className="h-8 bg-slate-100 rounded-lg w-full" />
          <div className="h-12 bg-slate-50 rounded-lg w-full" />
          <div className="h-12 bg-slate-50 rounded-lg w-full" />
          <div className="h-12 bg-slate-50 rounded-lg w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your customer database and records.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition-all duration-200 flex items-center gap-2 text-sm cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Customer
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4">
        <CustomerTable
          customers={customers}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            onClick={() => !isSubmitting && setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          />
          
          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-md w-full p-6 relative z-10 animate-toast-in">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h3>
              <button 
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                disabled={isSubmitting}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  disabled={isSubmitting}
                  placeholder="John Doe"
                  className="w-full border border-slate-200 px-3.5 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-800 disabled:opacity-50"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={isSubmitting}
                  placeholder="john@example.com"
                  className={`w-full border px-3.5 py-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-sm text-slate-800 disabled:opacity-50 ${
                    emailError
                      ? "border-rose-300 focus:border-rose-500 focus:ring-rose-100"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
                  }`}
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                />
                {emailError && (
                  <p className="text-rose-500 text-xs mt-1 animate-toast-in">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Phone</label>
                <input
                  type="text"
                  name="phone"
                  required
                  disabled={isSubmitting}
                  placeholder="+1 (555) 000-0000"
                  className="w-full border border-slate-200 px-3.5 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-800 disabled:opacity-50"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Company</label>
                <input
                  type="text"
                  name="company"
                  disabled={isSubmitting}
                  placeholder="Acme Corp"
                  className="w-full border border-slate-200 px-3.5 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-800 disabled:opacity-50"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select
                  name="status"
                  disabled={isSubmitting}
                  className="w-full border border-slate-200 px-3.5 py-2 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all text-sm text-slate-800 bg-white disabled:opacity-50"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition-all text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {isSubmitting ? "Saving..." : (editingCustomer ? "Update" : "Add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            onClick={() => setIsDeleteModalOpen(false)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
          />
          
          {/* Modal Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full p-6 relative z-10 animate-toast-in text-center">
            {/* Warning Icon */}
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-600 border border-rose-100 animate-pulse">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">Delete Customer</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Are you sure you want to delete this customer? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setCustomerToDelete(null);
                }}
                className="w-1/2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition-all text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-xl shadow-md shadow-rose-600/10 transition-all text-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;