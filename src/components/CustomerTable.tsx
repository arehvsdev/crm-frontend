export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  if (!customers || customers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl mt-4 text-center">
        <svg
          className="w-12 h-12 text-slate-300 mb-3 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <p className="text-slate-700 font-semibold text-base">No customers found</p>
        <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Get started by clicking the "Add Customer" button above.</p>
      </div>
    );
  }

  const getStatusBadge = (status?: string) => {
    const val = status || "Active";
    if (val === "Active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Active
        </span>
      );
    }
    if (val === "Inactive") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200/50">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Inactive
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
        {val}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/75">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {customers.map((customer) => (
            <tr
              key={customer._id}
              className="hover:bg-slate-50/50 transition-colors group"
            >
              <td className="px-6 py-4 font-semibold text-slate-700 text-sm">{customer.name}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{customer.email}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{customer.phone || "—"}</td>
              <td className="px-6 py-4 text-slate-500 text-sm">{customer.company || "—"}</td>
              <td className="px-6 py-4 text-sm">{getStatusBadge(customer.status)}</td>

              <td className="px-6 py-4 text-right space-x-2 shrink-0">
                <button
                  onClick={() => onEdit(customer)}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit
                </button>

                <button
                  onClick={() => onDelete(customer._id)}
                  className="inline-flex items-center gap-1 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
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

export default CustomerTable;