"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleMenu, setSelectedMenu, expandAllMenus, collapseAllMenus } from "@/store/menuSlice";
import { Menu, ChevronDown, ChevronRight, PlusCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function MenuPage() {
    const dispatch = useDispatch();
    const selectedMenu = useSelector((state: RootState) => state.menu.selectedMenu);
    const menus = useSelector((state: RootState) => state.menu.menus);
    const [name, setName] = useState(selectedMenu?.name || "");

    useEffect(() => {
        setName(selectedMenu?.name || "");
    }, [selectedMenu]);


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
                    <TreeItem label="Assets" id="assets" depth={1} parent="root">
                        <TreeItem label="Images" id="assets-images" depth={2} parent="assets">
                            <TreeItem label="image.jpg" id="assets-images-file" depth={3} parent="assets-images" />
                            <AddButton parentId="assets-images" depth={3} />
                        </TreeItem>
                        <TreeItem label="Fonts" id="assets-fonts" depth={2} parent="assets">
                            <TreeItem label="whitrabt.ttf" id="assets-fonts-file" depth={3} parent="assets-fonts" />
                            <TreeItem label="Images" id="assets-fonts-images" depth={3} parent="assets-fonts">
                                <TreeItem label="image.jpg" id="assets-fonts-images-file" depth={4} parent="assets-fonts-images" />
                                <AddButton parentId="assets-fonts-images" depth={4} />
                            </TreeItem>
                            <AddButton parentId="assets-fonts" depth={3} />
                        </TreeItem>
                        <AddButton parentId="assets" depth={2} />
                    </TreeItem>
                </div>

                {/* Form */}
                <div className="w-full md:w-1/2 border border-gray-700 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">{selectedMenu?.isNew ? "Add New Menu" : "Edit Menu"}</h2>
                    <form className="space-y-4">
                        {!selectedMenu?.isNew && (
                            <>
                                <InputField label="Menu ID" value={selectedMenu?.id || "New ID"} readOnly />
                                <InputField label="Depth" value={selectedMenu?.depth || ""} readOnly type="number" />
                                <InputField label="Parent Data" value={selectedMenu?.parent || ""} readOnly />
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

/* Komponen Tree Item */
const TreeItem = ({ label, id, depth, parent, children }: {
    label: string;
    id: string;
    depth: number;
    parent: string;
    children?: React.ReactNode;
}) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.menu.menus[id] || false);

    return (
        <div role="treeitem" aria-expanded={isOpen} className="relative">
            {/* Button untuk Expand/Collapse */}
            <button
                onClick={() => {
                    dispatch(toggleMenu(id));
                    dispatch(setSelectedMenu({ id, name: label, depth, parent }));
                }}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-all"
                aria-expanded={isOpen}
            >
                {children ? (isOpen ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />) : null}
                {label}
            </button>

            {/* Sub-menu dengan animasi */}
            {isOpen && (
                <div className="ml-4 border-l border-gray-600 pl-4 transition-all duration-300 ease-in-out">
                    {children}
                </div>
            )}
        </div>
    );
};

/* Komponen Add Button */
const AddButton = ({ parentId, depth }: { parentId: string; depth: number }) => {
    const dispatch = useDispatch();

    return (
        <button
            onClick={() => dispatch(setSelectedMenu({ id: "", name: "", depth: depth + 1, parent: parentId, isNew: true }))}
            className="flex items-center mt-1 p-1 text-green-400 hover:text-green-500 transition-all"
        >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Item
        </button>
    );
};

/* Komponen InputField */
const InputField = ({ label, value, onChange, readOnly = false, type = "text" }: {
    label: string;
    value: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    type?: string;
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            readOnly={readOnly}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
    </div>
);
