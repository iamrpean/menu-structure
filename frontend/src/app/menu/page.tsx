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

interface TreeItemProps {
    id: number;
    name: string;
    depth: number;
    parentId: number;
    childs?: TreeItemProps[];
}

interface Menus {
    id: number;
    name: string;
    depth?: number;
    parentId?: number;
    children?: Menus[];
}

export default function MenuPage() {
    const dispatch = useDispatch<AppDispatch>();
    const selectedMenu = useSelector((state: RootState) => state.menu.selectedMenu);
    const menus = useSelector((state: RootState) => state.menu.menu);
    const error = useSelector((state: RootState) => state.menu.error);
    const loading = useSelector((state: RootState) => state.menu.loading);
    const [name, setName] = useState<string>(selectedMenu?.name || "");
    const [rootMenuName, setRootMenuName] = useState<string>("");

    useEffect(() => {
        dispatch(fetchMenus());
    }, [dispatch]);

    useEffect(() => {
        setName(selectedMenu?.name || "");
    }, [selectedMenu]);

    const handleSubmit = async (e: React.FormEvent, isRoot: boolean = false) => {
        e.preventDefault();

        if (loading) return;

        try {
            const menuName = isRoot ? rootMenuName : name;
            if (!menuName.trim()) {
                throw new Error("Menu name is required");
            }

            if (isRoot || selectedMenu?.isNew) {
                await dispatch(
                    createMenu({
                        name: menuName,
                        parentId: isRoot ? undefined : selectedMenu?.parentId || undefined,
                    })
                ).unwrap();
            } else if (selectedMenu?.id) {
                await dispatch(
                    updateMenu({
                        id: selectedMenu.id,
                        name: menuName,
                        parent: selectedMenu.parentId || undefined,
                    })
                ).unwrap();
            }

            dispatch(setSelectedMenu(null));
            if (isRoot) setRootMenuName("");
            else setName("");
        } catch (error) {
            console.error("Error handling menu:", error);
            alert(error instanceof Error ? error.message : "An error occurred");
        }
    };

    const findParentName = (parentId: number | undefined, menu: Menus | null): string => {
        if (!parentId || !menu) return "No Parent"; // Jika tidak ada parentId atau menu
        if (menu.id === parentId) return menu.name; // Jika menu adalah parent-nya sendiri
        if (menu.children) {
            for (const child of menu.children) {
                const parentName = findParentName(parentId, child); // Rekursif untuk children
                if (parentName !== "No Parent") return parentName;
            }
        }
        return "No Parent";
    };

    const transformMenuToTreeItemProps = (menu: Menus): TreeItemProps => {
        return {
            id: menu.id,
            name: menu.name,
            depth: menu.depth || 1,
            parentId: menu.parentId || 0,
            childs: menu.children?.map(transformMenuToTreeItemProps),
        };
    };

    if (loading && !menus) return <div>Loading menus...</div>;
    // Hanya tampilkan error jika bukan karena tidak ada root menu
    if (error && error !== "No root menu found") return <div>Error: {error}</div>;

    return (
        <div className="flex flex-col min-h-screen p-8 gap-10 sm:p-20 font-sans">
            <h1 className="flex items-center text-3xl font-bold">
                <Menu className="mr-2 h-6 w-6 text-blue-400" />
                Menu Page
            </h1>

            <div className="flex flex-col gap-4 mb-4">
                {!menus && (
                    <div className="border border-gray-700 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Create Root Menu</h2>
                        <form
                            onSubmit={(e) => handleSubmit(e, true)}
                            className="space-y-4"
                        >
                            <InputField
                                label="Root Menu Name"
                                value={rootMenuName}
                                onChange={(e) => setRootMenuName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Create Root Menu
                                </button>
                            </div>
                        </form>
                    </div>
                )}
                <div className="flex gap-4">
                    <button
                        onClick={() => dispatch(expandAllMenus())}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || !menus}
                    >
                        Expand All
                    </button>
                    <button
                        onClick={() => dispatch(collapseAllMenus())}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || !menus}
                    >
                        Collapse All
                    </button>
                    <button
                        onClick={() =>
                            dispatch(
                                setSelectedMenu({
                                    id: Date.now(),
                                    name: "",
                                    depth: 1,
                                    parentId: menus?.id || 0,
                                    isNew: true,
                                })
                            )
                        }
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || !menus}
                    >
                        Add New Menu
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full">
                <div
                    role="tree"
                    aria-orientation="vertical"
                    className="w-full md:w-1/2 max-w-md border border-gray-700 p-4 rounded-lg"
                >
                    {menus ? (
                        <TreeItem
                            key={menus.id}
                            id={menus.id}
                            name={menus.name}
                            depth={menus.depth || 1}
                            parentId={menus.parentId || 0}
                            childs={menus.children?.map(transformMenuToTreeItemProps)}
                        />
                    ) : (
                        <div>No menu items available</div>
                    )}
                </div>

                {selectedMenu && (
                    <div className="w-full md:w-1/2 border border-gray-700 p-4 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedMenu.isNew ? "Add New Menu" : "Edit Menu"}
                        </h2>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {!selectedMenu.isNew && (
                                <>
                                    <InputField
                                        label="Menu ID"
                                        value={selectedMenu.id}
                                        readOnly
                                        type="number"
                                    />
                                    <InputField
                                        label="Depth"
                                        value={selectedMenu.depth}
                                        readOnly
                                        type="number"
                                    />
                                </>
                            )}
                            <InputField
                                label="Parent Name"
                                value={findParentName(selectedMenu?.parentId, menus)}
                                readOnly
                            />
                            <InputField
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {selectedMenu.isNew ? "Add Menu" : "Update Menu"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        dispatch(setSelectedMenu(null));
                                        setName("");
                                    }}
                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}