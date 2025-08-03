import { useQuery } from "@tanstack/react-query"
import { authService } from "../services/auth.service"
import type { AuthFormResponse } from "../types/auth.types"


export const useUserQuery = () => {
    return useQuery<AuthFormResponse>({
        queryKey: ["me"],
        queryFn: () => authService.getMe().then(res => res.data),
    })
}