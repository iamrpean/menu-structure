"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toggleSidebar } from "@/store/sidebarSlice";

const Sidebar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300",
                isOpen ? "w-64" : "w-20"
            )}
        >
            <button
                onClick={() => dispatch(toggleSidebar())}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700"
            >
                <Menu size={20} />
            </button>

            <nav className="mt-16 flex flex-col space-y-4">
                <MenuItem href="/" icon={<Home size={24} />} isOpen={isOpen} label="Home" pathname={pathname} />
                <MenuItem href="/menu" icon={<Menu size={24} />} isOpen={isOpen} label="Menu" pathname={pathname} />
            </nav>
        </aside>
    );
};

interface MenuItemProps {
    href: string;
    icon: React.ReactNode;
    isOpen: boolean;
    label: string;
    pathname: string;
}

const MenuItem = ({ href, icon, isOpen, label, pathname }: MenuItemProps) => (
    <Link href={href}>
        <div
            className={cn(
                "flex items-center space-x-2 p-3 rounded-lg mx-2 transition-all",
                pathname === href ? "bg-blue-500" : "hover:bg-gray-700",
                isOpen ? "" : "justify-center"
            )}
        >
            {icon}
            {isOpen && <span className="text-lg">{label}</span>}
        </div>
    </Link>
);

export default Sidebar;
