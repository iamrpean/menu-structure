"use client";

import { useDispatch } from "react-redux";
import { setSelectedMenu } from "@/store/menuSlice";
import { PlusCircle } from "lucide-react";
import React from "react";

interface AddButtonProps {
    parentId: string;
    depth: number;
}

const AddButton: React.FC<AddButtonProps> = ({ parentId, depth }) => {
    const dispatch = useDispatch();

    return (
        <button
            onClick={() =>
                dispatch(
                    setSelectedMenu({
                        id: "",
                        name: "",
                        depth: depth + 1,
                        parent: parentId,
                        isNew: true,
                    })
                )
            }
            className="flex items-center mt-1 p-1 text-green-400 hover:text-green-500 transition-all"
        >
            <PlusCircle className="w-4 h-4 mr-1" />
            Add Item
        </button>
    );
};

export default AddButton;