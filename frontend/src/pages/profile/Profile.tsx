import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PrimaryButton } from "../../shared/components/buttons/PrimaryButton";
import { authService } from "../../services/auth.service";
import { useUserQuery } from "../../hooks/useUserQuery";
import { toast } from "react-toastify";

function Profile() {
    const { data } = useUserQuery()
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess: async () => {
            await queryClient.cancelQueries({ queryKey: ['me'] });
            await queryClient.setQueryData(['me'], null);
            toast.success("You are successfully logged out")
        }
    })

    const time = data?.createdAt ? new Date(data.createdAt).toUTCString() : "unknown"

    return (
        <div className="w-full flex  items-center flex-col">

            <p>{data?.email}</p>
            <p className="text-center">User was created: <br />{time}</p>
            <PrimaryButton className="px-2" onClick={() => mutate()}>Logout</PrimaryButton>
        </div>
    );
}

export default Profile;