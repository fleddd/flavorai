import { axiosWithAuth } from '../api/interceptors'
import type { AuthFormResponse } from '../types/auth.types'
class UserService {
    async getMe() {
        const response = await axiosWithAuth.get<AuthFormResponse>(`/users/me`)
        return response
    }

}

export const userService = new UserService()