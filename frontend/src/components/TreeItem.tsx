"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { toggleMenu, setSelectedMenu } from "@/store/menuSlice";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";
import AddButton from "@/components/AddButton";

interface TreeItemProps {
    id: number;
    name: string;
    depth: number;
    parentId: number;
    childs?: TreeItemProps[];
}

const TreeItem: React.FC<TreeItemProps> = ({
    id,
    name,
    depth = 1,
    parentId = 0,
    childs = [],
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const isOpen = useSelector((state: RootState) => state.menu.expandedMenus[id] ?? false);
    const isSelected = useSelector((state: RootState) => state.menu.selectedMenu?.id === id);

    const handleToggle = () => {
        dispatch(toggleMenu(id));
        dispatch(
            setSelectedMenu({
                id,
                name,
                depth,
                parentId,
                isNew: false,
            })
        );
    };

    return (
        <div
            role="treeitem"
            aria-expanded={isOpen}
            aria-selected={isSelected}
            aria-level={depth}
            className="relative"
        >
            <div className="flex items-center">
                <button
                    onClick={handleToggle}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-700 transition-all"
                    aria-expanded={isOpen}
                >
                    {childs.length > 0 ? (
                        isOpen ? (
                            <ChevronDown className="w-5 h-5 mr-2" />
                        ) : (
                            <ChevronRight className="w-5 h-5 mr-2" />
                        )
                    ) : (
                        <span className="w-5 h-5 mr-2" />
                    )}
                    <span>{name || "Unnamed Menu"}</span>
                </button>
            </div>

            {isOpen && (
                <div 
                    className={`ml-${depth * 4} border-l border-gray-600 pl-4 transition-all duration-300 ease-in-out`}
                >
                    {childs.map((child, index) => (
                        <TreeItem
                            key={child.id}
                            id={child.id}
                            name={child.name}
                            depth={child.depth || depth + 1}
                            parentId={child.parentId || id}
                            childs={child.childs}
                            aria-posinset={index + 1}
                            aria-setsize={childs.length}
                        />
                    ))}
                    {/* AddButton di akhir setiap level */}
                    <AddButton parentId={id} depth={depth + 1} />
                </div>
            )}
        </div>
    );
};

export default TreeItem;