import { Link } from "react-router";
import { twMerge } from "tailwind-merge";

function NavLink({ text, to, className, mobile = false }: { text: string, to: string, className?: string, mobile?: boolean }) {
    return (
        <Link
            to={to}
            className={twMerge(className, `
        block px-4 py-2 text-sm font-medium rounded-md
        ${mobile ? "text-gray-700 hover:bg-gray-100" : "text-gray-600 hover:text-gray-900"}
        transition-colors duration-200
      `)}
        >
            {text}
        </Link>);
}

export default NavLink;