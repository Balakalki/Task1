"use client";
import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  placeholder: string;
  options: {
    label : string,
    value : string
  }[];
  image: string;
  onSelect: (selectedItem: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  val?: string;
}

const CustomDropdown = ({placeholder, image, val, options, onSelect, onFocus, onBlur }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(placeholder);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (val) {
      setSelected(val);
    } else {
      setSelected(placeholder);
    }
  }, [val]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen && onFocus) {
      onFocus(); // Notify parent about focus
    }
  };

  const handleSelect = (item: string) => {
    setSelected(item);
    setIsOpen(false);
    onSelect(item);
    if(onBlur){
      onBlur();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
    if(onBlur){
      onBlur();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative cursor-pointer w-full" ref={dropdownRef}>
      <button
        className={`w-full cursor-pointer h-[45] rounded-lg ${selected === placeholder? 'text-gray-400':'text-black'} font-bold py-2 px-4 flex justify-between items-center`}
        onClick={toggleDropdown}
      >
        {selected}
        <img src={image} alt=">" />
      </button>
      {isOpen && (
        <ul className="absolute z-20 w-full bg-white text-black shadow-[0px_0px_20px_rgba(0,0,0,0.1)] border-[rgba(0,0,0,0.1)] rounded-lg mt-2">
          {options.map((item, index) => (
            <li
              key={index}
              className="hover:bg-gray-200 py-2 px-4 cursor-pointer"
              onClick={() => handleSelect(item.value)}
            >
              {item.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;

