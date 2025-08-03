import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import { PAGES } from "../config/pages-url.config";
import ProtectedRoute from "./ProtectedRoute";
import { LoadingPage } from "../pages";

const Home = lazy(() => import("../pages").then(m => ({ default: m.Home })));
const Public = lazy(() => import("../pages").then(m => ({ default: m.Public })));
const Auth = lazy(() => import("../pages").then(m => ({ default: m.Auth })));
const Profile = lazy(() => import("../pages").then(m => ({ default: m.Profile })));
const NewRecipe = lazy(() => import("../pages").then(m => ({ default: m.NewRecipe })));
const ViewRecipe = lazy(() => import("../pages").then(m => ({ default: m.ViewRecipe })));
const HomeLayout = lazy(() => import("../pages").then(m => ({ default: m.HomeLayout })));

export function Router() {
    return (
        <Suspense fallback={<LoadingPage />}>
            <Routes>
                <Route index element={<Public />} />
                <Route path={PAGES.AUTH} element={<ProtectedRoute><Auth /></ProtectedRoute>} />
                <Route path={PAGES.HOME} element={<ProtectedRoute><HomeLayout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                    <Route path={PAGES.RELATIVE.NEW_RECIPE} element={<NewRecipe />} />
                    <Route path={PAGES.RELATIVE.PROFILE} element={<Profile />} />
                    <Route path={PAGES.RECIPE_DETAILS(":id")} element={<ViewRecipe />} />
                </Route>
            </Routes>
        </Suspense>
    );
}
