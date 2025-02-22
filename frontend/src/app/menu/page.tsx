"use client";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
    expandAllMenus,
    collapseAllMenus,
    fetchMenus,
    createMenu,
    updateMenu,
    setSelectedMenu,
} from "@/store/menuSlice";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import InputField from "@/components/InputField";
import TreeItem from "@/components/TreeItem";

interface MenuItem {
    id: any;
    name: string;
    depth: number;
    parent?: number;
    children?: MenuItem[];
}

export default function MenuPage() {
    const dispatch = useDispatch<AppDispatch>();
    const selectedMenu = useSelector((state: RootState) => state.menu.selectedMenu);
    const menus = useSelector((state: RootState) => state.menu.menus);
    const loading = useSelector((state: RootState) => state.menu.loading);
    const error = useSelector((state: RootState) => state.menu.error);
    const [name, setName] = useState(selectedMenu?.name || "");

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);

    useEffect(() => {
        setName(selectedMenu?.name || "");
    }, [selectedMenu]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (selectedMenu?.isNew) {
                await dispatch(
                    createMenu({
                        name,
                        parentId: selectedMenu.parent ? selectedMenu.parent : undefined,
                    })
                ).unwrap();
            } else if (selectedMenu?.id) {
                await dispatch(
                    updateMenu({
                        id: selectedMenu.id,
                        name,
                        parent: selectedMenu.parent,
                    })
                ).unwrap();
            }

            // dispatch(fetchMenus());
            dispatch(setSelectedMenu(null));
            setName("");
        } catch (error) {
            console.error("Error handling menu:", error);
        }
    };
    

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col min-h-screen p-8 gap-10 sm:p-20 font-sans">
            <h1 className="flex items-center text-3xl font-bold">
                <Menu className="mr-2 h-6 w-6 text-blue-400" />
                Menu Page
            </h1>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => dispatch(expandAllMenus())}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                >
                    Expand All
                </button>
                <button
                    onClick={() => dispatch(collapseAllMenus())}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                >
                    Collapse All
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* Tree */}
                <div role="tree" aria-orientation="vertical" className="w-full md:w-1/2 max-w-md border border-gray-700 p-4 rounded-lg">
                    {Array.isArray(menus) && menus.length > 0 && (
                        <TreeItem
                            key={menus[0].id}
                            label={menus[0].name}
                            id={menus[0].id}
                            depth={1}
                            parent={0}
                            children={menus[0].children}
                        />
                    )}
                </div>

                {/* Form */}
                <div className="w-full md:w-1/2 border border-gray-700 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        {selectedMenu?.isNew ? "Add New Menu" : "Edit Menu"}
                    </h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {!selectedMenu?.isNew && (
                            <>
                                <InputField label="Menu ID" value={selectedMenu?.id || "New ID"} readOnly />
                                <InputField label="Depth" value={selectedMenu?.depth || ""} readOnly type="number" />
                                <InputField label="Parent Name" value={selectedMenu?.parent} readOnly />
                            </>
                        )}
                        <InputField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg">
                            {selectedMenu?.isNew ? "Add Menu" : "Update Menu"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
