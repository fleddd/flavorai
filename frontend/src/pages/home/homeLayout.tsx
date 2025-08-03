import { Outlet } from "react-router";
import Header from "../../components/home/header";

function HomeLayout() {
    return (
        <div className='w-full min-h-dvh bg-lime-900/10 flex flex-col gap-5' >
            <Header />
            <div className="h-full flex-1 flex px-4">
                <Outlet />
            </div>
        </div >
    );
}

export default HomeLayout;