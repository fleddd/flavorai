import { CircularProgress } from "@mui/material";

function LoadingPage() {
    return (
        <div className="w-dvw  h-dvh flex justify-center items-center flex-col gap-3">
            <CircularProgress size={100} color="primary" />
            <h1>Loading...</h1>
        </div>
    );
}

export default LoadingPage;