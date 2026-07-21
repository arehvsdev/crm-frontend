import api from './api';

export const registerUser = async(userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
}

export const loginUser = async(userData) => {
    const response = await api.post("/users/login", userData);
    return response.data;
}

export const getProfile = async() => {
    const token = localStorage.getItem("token");
    const response = await api.get("/users/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}