import { axiosClassic, axiosWithAuth } from '../api/interceptors'
import type { AuthForm, AuthFormResponse } from '../types/auth.types'

class AuthService {
    async authorizeLocal(type: "login" | "register", data: AuthForm) {
        return await axiosWithAuth.post<AuthFormResponse>(`/auth/${type}`, data)
    }
    async getNewTokens() {
        return await axiosClassic.get('/auth/refresh')
    }
    async logout() {
        return await axiosWithAuth.get('/auth/logout')
    }
    async getMe() {
        return await axiosWithAuth.get<AuthFormResponse>(`/users/me`)
    }
}

export const authService = new AuthService()