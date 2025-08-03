
import TextField from "@mui/material/TextField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PAGES } from "../../config/pages-url.config";
import { authService } from "../../services/auth.service";
import type { AuthFailedResponse, AuthForm } from "../../types/auth.types";
import { useNavigate } from "react-router";
import { PrimaryButton } from "../../shared/components/buttons/PrimaryButton";
import type { AxiosError } from "axios";

export default function Auth() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthForm>({
        mode: "onChange"
    })

    const [isLoginForm, setIsLoginForm] = useState(true)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutateAsync } = useMutation({
        mutationKey: ['auth'],
        mutationFn: (data: AuthForm) => authService.authorizeLocal(isLoginForm ? 'login' : 'register', data),
        onError: (error: AxiosError<AuthFailedResponse>) => {
            toast.error(error.response?.data?.message || 'An error occurred during authentication');
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['me'] })
            navigate(PAGES.HOME, { replace: true })
            reset()
            toast.success("You are successfully logged in")
        }
    })

    const onSubmit: SubmitHandler<AuthForm> = async (data) => {
        await mutateAsync(data)

    }

    return (
        <div className="w-full h-dvh">
            <form onSubmit={handleSubmit(onSubmit)} className="h-full flex justify-center items-center flex-col gap-10">
                <div>
                    <h1 className="text-4xl">{isLoginForm ? 'Sign in' : 'Sign up'}</h1>
                </div>
                <div className="flex flex-col gap-6 rounded-xl p-5 w-80">
                    <TextField type="email" error={!!errors.email} helperText={errors.email?.message} label="Email" {...register('email', { required: true })}  >
                        Email
                    </TextField>
                    <TextField error={!!errors.password} helperText={errors.password?.message} label="Password" {...register('password', { required: true })}  >
                        Password
                    </TextField>
                    <div>
                        <p>{isLoginForm ? 'Don\'t have an account?' : 'Already have an account?'} <button type="button" className="text-primary cursor-pointer hover:text-primary/80" onClick={() => setIsLoginForm(prev => !prev)}>{isLoginForm ? 'Sign up' : 'Sign in'} here.</button></p>
                    </div>
                    <PrimaryButton type="submit" className="w-full">{isLoginForm ? 'Sign in' : 'Sign up'}</PrimaryButton>
                </div>
            </form>
        </div>
    )
}
