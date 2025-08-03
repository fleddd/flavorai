import { PAGES } from "../../config/pages-url.config";
import NavLink from "./NavLink";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchBar from "./searchBar";

function Header() {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="w-full bg-white border-b border-gray-200 px-4 sm:px-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-4">

                {/* Top Row: Nav + Menu */}
                <div className="flex items-center justify-between w-full sm:w-auto">
                    {/* Navigation - Desktop */}
                    {!isMobile && (
                        <nav className="flex gap-6">
                            <NavLink text="Home" to={PAGES.HOME} />
                            <NavLink text="Profile" to={PAGES.PROFILE} />
                            <NavLink text="Add recipe" to={PAGES.NEW_RECIPE} />
                        </nav>
                    )}

                    {/* Mobile Menu Toggle */}
                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-md hover:bg-gray-100 text-[#627f34]"
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <CloseIcon /> : <MenuIcon />}
                        </button>
                    )}
                </div>

                {/* Search Bar */}
                <div className="w-full sm:max-w-md transition-all duration-300">
                    <SearchBar />
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobile && menuOpen && (
                <nav
                    className="flex flex-col gap-3 mt-3 pb-3 border-t border-gray-200 pt-3"
                    onClick={() => setMenuOpen(false)}
                >
                    <NavLink text="Home" to={PAGES.HOME} />
                    <NavLink text="Profile" to={PAGES.PROFILE} />
                    <NavLink text="Add recipe" to={PAGES.NEW_RECIPE} />
                </nav>
            )}
        </header>
    );
}

export default Header;
