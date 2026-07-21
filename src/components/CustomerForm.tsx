import { useState, useEffect } from "react";

interface Customer {
  id?: string | number;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  status: string;
}

interface CustomerFormProps {
  onSubmit: (customer: Customer) => void;
  editingCustomer: Customer | null;
}

function CustomerForm({ onSubmit, editingCustomer }: CustomerFormProps) {

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    status: "Active",
  });

  useEffect(() => {
    if (editingCustomer) {
      setCustomer(editingCustomer);
    }
  }, [editingCustomer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customer);

    setCustomer({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      status: "Active",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow space-y-4"
    >
      <input
        name="name"
        placeholder="Name"
        value={customer.name}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        name="email"
        type="email"
        placeholder="Email"
        value={customer.email}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        name="phone"
        placeholder="Phone"
        value={customer.phone}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        name="company"
        placeholder="Company"
        value={customer.company}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="address"
        placeholder="Address"
        value={customer.address}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <select
        name="status"
        value={customer.status}
        onChange={handleChange}
        className="border p-2 w-full"
      >
        <option>Active</option>
        <option>Inactive</option>
      </select>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {editingCustomer ? "Update Customer" : "Add Customer"}
      </button>
    </form>
  );
}

export default CustomerForm;