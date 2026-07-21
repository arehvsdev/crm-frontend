import api from "./api";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getCustomers = async () => {
  const response = await api.get("/customers", getAuthHeader());
  return response.data;
};

export const addCustomer = async (customer: any) => {
  const response = await api.post(
    "/customers",
    customer,
    getAuthHeader()
  );
  return response.data;
};

export const updateCustomer = async (id: any, customer: any) => {
  const response = await api.put(
    `/customers/${id}`,
    customer,
    getAuthHeader()
  );
  return response.data;
};

export const deleteCustomer = async (id: any) => {
  const response = await api.delete(
    `/customers/${id}`,
    getAuthHeader()
  );
  return response.data;
};