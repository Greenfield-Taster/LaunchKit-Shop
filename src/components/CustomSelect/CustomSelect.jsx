import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import "./CustomSelect.scss";

const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select" ref={selectRef}>
      <div
        className={`custom-select__trigger ${isOpen ? "custom-select__trigger--open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="custom-select__value">
          {selectedOption ? selectedOption.label : "Оберіть..."}
        </span>
        <ChevronDown
          className={`custom-select__icon ${isOpen ? "custom-select__icon--open" : ""}`}
          size={16}
        />
      </div>

      {isOpen && (
        <div className="custom-select__dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select__option ${
                option.value === value ? "custom-select__option--selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
