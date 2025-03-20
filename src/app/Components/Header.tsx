"use client";
import { useState, useEffect, useCallback } from "react";
import { RangeSlider } from "@mantine/core";
import "@mantine/core/styles.css";
import CreateJobModal from "./Create_job_modal";
import classes from "./SliderLabel.module.css";
import CustomDropdown from "./CustomDropdown";
import { debounce } from "@mui/material";

interface SearchBoxProps {
  onSearch: (filters: {
    query: string;
    location: string;
    job_Type: string;
    salary_Min: number;
    salary_Max: number;
  }) => void;
  onPosted: (status: boolean) => void;
}
interface Filters{
    query: string;
    location: string;
    job_Type: string;
    salary_Min: number;
    salary_Max: number;
}

export default function Header({ onSearch, onPosted }: SearchBoxProps) {
  const menuItems = ["Home", "Find Talents", "About us", "Testimonials"];
  const [range, setRange] = useState<[number, number]>([0, 500]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const Locations = [{label:"All Locations", value:"All Locations"},{label:"Chennai", value:"Chennai"}, {label:"Hyderabad", value:"Hyderabad"}, {label:"Delhi", value:"Delhi"}, {label:"Benguluru", value:"Benguluru"}];
  const JobTypes = [{label:"All Job Types", value:"All Job Types"}, {label: "Full-time", value:"Full Time"}, {label:"Part-time", value:"Part Time"}, {label:"Contract", value:"Contract"}, {label:"Internship", value:"Internship"}];


  const [filters, setFilters] = useState({
    query: "",
    location: "",
    job_Type: "",
    salary_Min: 0,
    salary_Max: 500000,
  });
  const handleChange = (name: string, value: string) => {
    if(name === "location" && value === "All Locations"){
      value = "";
    }
    else if(name === "job_Type"){
      if(value === "All Job Types"){
        value = "";
      }else if(value === "Full Time"){
        value = "Full-time";
      }else if(value === "Part Time"){
        value = "Part-time";
      }
    }
    setFilters((prev) => ({
      ...prev,
      [name]: value, 
    }));
  };
  
  const debouncedSetFilters = useCallback(
    debounce((updatedFilters: (prev: Filters) => Filters) => {
      setFilters(updatedFilters);
    }, 300), 
    []
  );
  const handleSalaryChange = (newRange: [number, number]) => {
    const [newMin, newMax] = newRange;

    // Ensure salary_Min is never greater than salary_Max
    const updatedSalaryMin = newMin >= newMax ? newMax - 1 : newMin;
    const updatedSalaryMax = newMax <= updatedSalaryMin ? updatedSalaryMin + 1 : newMax;

    // Update the filters state with new salary values
    debouncedSetFilters((prev) => ({
      ...prev,
      salary_Min: updatedSalaryMin,
      salary_Max: updatedSalaryMax,
    }));
    setRange([newMin, newMax]);
  }

  // Use useEffect to call onSearch only after filters are updated
  useEffect(() => {
    onSearch(filters);
  }, [filters]); // Runs every time filters change

  return (
    <div className="w-full flex flex-col">
      {/* Top Header */}
      <div className="flex py-5  w-full justify-center">
        <div className="px-10 items-center  flex h-18 bg-white rounded-[2.5rem] shadow-[0px_0px_20px_rgba(0,0,0,0.1)]">
          <div className="w-20">
            <img
              className="h-12 cursor-pointer"
              src="https://www.cybermindworks.com/images/cmwlogo.svg"
              alt=""
            />
          </div>
          {menuItems.map((item, ind) => (
            <div
              key={ind}
              className="px-7 cursor-pointer py-2 font-semibold rounded-2xl transition-all duration-300 
                      hover:shadow-[0_3px_2px_rgba(0,0,0,0.1)] 
                      hover:scale-100 hover:translate-y-1 hover:translate-x-1 hover:bg-white will-change-transform transform-gpu"
            >
              {item}
            </div>
          ))}

          <div className="ml-6 group cursor-pointer hover:bg-gray-100 rounded-md py-1 flex items-center px-2">
            <button
              style={{
                background:
                  "linear-gradient(to bottom, rgba(161, 40, 255, 1), rgba(97, 0, 173, 1))",
                borderRadius: "9999px",
                border: "none",
              }}
              onClick={() => setIsModalOpen(true)}
              className={`relative cursor-pointer group-hover:scale-105 w-32 h-10 overflow-hidden rounded-lg bg-blue-600 text-white font-semibold`}
            >
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-full">
                Create Job
              </span>
              <span className="absolute inset-0 flex items-center justify-center transition-transform duration-300 translate-y-full group-hover:translate-y-0">
                Login
              </span>
            </button>
          </div>


        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 py-4 h-20 px-20 shadow-md shadow-[rgba(0,0,0,0.03)] w-full">
        {/* Search Query */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-200 flex items-center gap-6">
          <img src="./search.png" className="h-5 w-5"></img>
          <input
            type="text"
            name="query"
            placeholder="Search By Job Title, Role"
            value={filters.query}
            onChange={(e) => handleChange("query", e.target.value)}
            className="text-[16px] outline-none p-4 pb-2  mb-2 border-[rgba(0,0,0,0.1)] focus:border-b-2"
          />
        </div>

        {/* Location */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-200 flex items-center gap-6">
          <img src="./location.png" className="h-6 w-5"></img>
          <div className="w-full relative">
            <CustomDropdown 
            onSelect={(value) => handleChange("location", value)}
            placeholder="Preferred Location"
            image="/Down 2.png"
            options={Locations}
            />
          </div>
        </div>

        {/* Job Type Dropdown */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-200 flex items-center gap-6">
          <img className="h-5 w-5" src="./job_type.png"></img>
          <div className="w-full relative">
            <CustomDropdown 
            placeholder="Job Type"
            options={JobTypes}
            image="/Down 2.png"
            onSelect={(value) => handleChange("job_Type", value)}
            />
          </div>
        </div>

        {/* Salary Range Slider (Single Line) */}
        <div className="w-[25%] px-3 py-1 gap-2 flex flex-col">
          <div className="flex justify-between font-semibold">
            <p>Salary Per Month</p>
            <p className="">₹{range[0]}k - ₹{range[1]}k</p>
          </div>
          <RangeSlider
            value={range}
            onChange={handleSalaryChange}
            min={0}
            max={500}
            step={10}
            classNames={{
              thumb: classes.thumb,
              label: classes.label,
              track: classes.track,
              bar: classes.bar,
            }}
            labelAlwaysOn
            label={null}
            className="px-2"
          />
        </div>
      </div>
      {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} isPosted={onPosted} />}
    </div>
  );
}
