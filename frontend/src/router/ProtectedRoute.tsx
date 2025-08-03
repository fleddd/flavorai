// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router'
import { PAGES } from '../config/pages-url.config';
import LoadingPage from '../pages/loading';
import { useUserQuery } from '../hooks/useUserQuery';
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const path = useLocation().pathname;
    const { data: user, isLoading, isFetched, isError } = useUserQuery()


    if (isLoading || !isFetched) return <LoadingPage />;

    if (path.startsWith('/home') && (!user || isError)) {
        return <Navigate to={PAGES.AUTH} replace />;
    }

    if (path.startsWith('/auth') && user) {
        return <Navigate to={PAGES.HOME} replace />;
    }
    return <>
        {children}
    </>


}
