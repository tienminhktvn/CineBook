import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// IMDb-inspired input styling
export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#aaa]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-4 py-2.5
          bg-[#1f1f1f] border border-[#444]
          rounded-lg text-white placeholder-[#666]
          focus:outline-none focus:ring-2 focus:ring-[#f5c518] focus:border-transparent
          transition-all duration-200
          ${error ? "border-[#f54336] focus:ring-[#f54336]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-[#f54336]">{error}</p>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = "",
  id,
  ...props
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-[#aaa]"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full px-4 py-2.5
          bg-[#1f1f1f] border border-[#444]
          rounded-lg text-white
          focus:outline-none focus:ring-2 focus:ring-[#f5c518] focus:border-transparent
          transition-all duration-200
          ${error ? "border-[#f54336] focus:ring-[#f54336]" : ""}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-[#f54336]">{error}</p>}
    </div>
  );
};

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-[#aaa]"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`
          w-full px-4 py-2.5
          bg-[#1f1f1f] border border-[#444]
          rounded-lg text-white placeholder-[#666]
          focus:outline-none focus:ring-2 focus:ring-[#f5c518] focus:border-transparent
          transition-all duration-200 resize-none
          ${error ? "border-[#f54336] focus:ring-[#f54336]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-sm text-[#f54336]">{error}</p>}
    </div>
  );
};
