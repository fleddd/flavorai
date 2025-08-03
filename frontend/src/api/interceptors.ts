
import axios, { AxiosError, type AxiosRequestConfig, type CreateAxiosDefaults } from "axios";
import { authService } from "../services/auth.service";
import { QueryClient } from "@tanstack/react-query";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    _retry?: boolean;
}
const options: CreateAxiosDefaults = {
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
};

const axiosClassic = axios.create(options); // plain instance without interceptors

const axiosWithAuth = axios.create(options);

const queryClient = new QueryClient()


axiosWithAuth.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await authService.getNewTokens();
                queryClient.invalidateQueries({ queryKey: ['me'] });


                return axiosWithAuth(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export { axiosClassic, axiosWithAuth };
