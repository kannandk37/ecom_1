import React, { useState, useRef, useEffect } from "react";
import "./DropDown.css";
import { FiChevronDown } from "react-icons/fi";

interface DropdownOption {
  id: string | number;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  width?: string;
  height?: string;
  onSelect?: (option: DropdownOption) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  width = "200px",
  height = "45px",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: DropdownOption) => {
    setSelectedValue(option.value);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="ds-dropdown-container" ref={dropdownRef} style={{ width }}>
      <button
        className={`ds-dropdown-header ${isOpen ? "ds-dropdown-header--active" : ""}`}
        onClick={toggleDropdown}
        style={{ height }}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="ds-dropdown-label">{selectedValue || label}</span>
        <FiChevronDown
          className={`ds-dropdown-arrow ${isOpen ? "ds-dropdown-arrow--open" : ""}`}
        />
      </button>

      {isOpen && (
        <ul className="ds-dropdown-list" role="listbox">
          {options.map((option) => (
            <li
              key={option.id}
              className={`ds-dropdown-item ${selectedValue === option.value ? "ds-dropdown-item--selected" : ""}`}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={selectedValue === option.value}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
