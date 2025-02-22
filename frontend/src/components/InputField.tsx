import React from "react";

interface InputFieldProps {
    label: string;
    value: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readOnly?: boolean;
    type?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, readOnly = false, type = "text" }) => (
    <div>
        <label className="block text-sm font-medium text-gray-300">{label}</label>
        <input
            type={type}
            value={value ?? ""}
            onChange={onChange}
            readOnly={readOnly}
            className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg"
        />
    </div>
);

export default InputField;