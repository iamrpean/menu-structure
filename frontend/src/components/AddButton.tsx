"use client";

import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setSelectedMenu } from "@/store/menuSlice";
import { PlusCircle } from "lucide-react";
import React from "react";

interface AddButtonProps {
    parentId: number;
    depth: number;
}

const AddButton: React.FC<AddButtonProps> = ({ parentId, depth }) => {
    const dispatch = useDispatch<AppDispatch>();

    // Fungsi untuk menentukan margin left berdasarkan depth
    const getMarginLeftClass = (depth: number) => {
        switch (depth) {
            case 1:
                return "ml-4"; 
            case 2:
                return "ml-6"; 
            case 3:
                return "ml-8"; 
            case 4:
                return "ml-10"; 
            case 5:
                return "ml-12";
            default:
                return "ml-4"; 
        }
    };

    return (
        <button
            onClick={() =>
                dispatch(
                    setSelectedMenu({
                        id: Date.now(),
                        name: "",
                        depth,
                        parentId,
                        isNew: true,
                    })
                )
            }
            className={`${getMarginLeftClass(depth)} p-1 text-green-400 hover:text-green-500 transition-all`}
            aria-label="Add new menu item"
        >
            <PlusCircle className="w-4 h-4 inline mr-1" />
        </button>
    );
};

export default AddButton;