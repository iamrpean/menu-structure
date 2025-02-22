"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleMenu, setSelectedMenu } from "@/store/menuSlice";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import AddButton from "@/components/AddButton";

interface TreeItemProps {
    label: string;
    id: string;
    depth: number;
    parent: number;
    children?: any[];
}

const TreeItem: React.FC<TreeItemProps> = ({ label, id, depth = 1, parent, children = [] }) => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state: RootState) => state.menu.menus[id] || false);

    return (
        <div role="treeitem" aria-expanded={isOpen} className="relative">
            <button
                onClick={() => {
                    dispatch(toggleMenu(id));
                    dispatch(setSelectedMenu({ id, name: label, depth, parent }));
                }}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-all"
                aria-expanded={isOpen}
            >
                {children.length > 0 ? (
                    isOpen ? (
                        <ChevronDown className="w-5 h-5 mr-2" />
                    ) : (
                        <ChevronRight className="w-5 h-5 mr-2" />
                    )
                ) : null}
                {label}
            </button>

            {isOpen && children.length > 0 && (
                <div className="ml-4 border-l border-gray-600 pl-4 transition-all duration-300 ease-in-out">
                    {children.map((child) => (
                        <TreeItem
                            key={child.id}
                            label={child.name}
                            id={child.id}
                            depth={depth + 1} 
                            parent={id}
                            children={child.children || []}
                        />
                    ))}
                    <AddButton parentId={id} depth={depth + 1} />
                </div>
            )}

            {isOpen && children.length === 0 && <AddButton parentId={id} depth={depth + 1} />}
        </div>
    );
};
export default TreeItem;