"use client";
import { useState, useEffect } from "react";
import { RangeSlider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import CreateJobModal from "./Create_job_modal";
import classes from "./SliderLabel.module.css";

interface SearchBoxProps {
  onSearch: (filters: {
    query: string;
    location: string;
    job_Type: string;
    salary_Min: number;
    salary_Max: number;
  }) => void;
}

export default function Header({ onSearch }: SearchBoxProps) {
  const menuItems = ["Home", "Find Talents", "About us", "Testimonials"];
  const [range, setRange] = useState<[number, number]>([50, 80]);
  const [isModalOpen, setIsModalOpen] = useState(false)

  
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    job_Type: "",
    salary_Min: 0,
    salary_Max: 1100000,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
  
    setFilters((prev) => {
      let updatedFilters = { ...prev, [name]: value };
  
      return updatedFilters;
    });
  };
  const handleSalaryChange = (newRange: [number, number]) => {
    const [newMin, newMax] = newRange;

    // Ensure salary_Min is never greater than salary_Max
    const updatedSalaryMin = newMin >= newMax ? newMax - 1 : newMin;
    const updatedSalaryMax = newMax <= updatedSalaryMin ? updatedSalaryMin + 1 : newMax;

    // Update the filters state with new salary values
    setFilters((prev) => ({
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
        <div className="px-10 items-center w-[60%] flex justify-between h-14 bg-white rounded-[2.5rem] shadow-[0px_0px_20px_rgba(0,0,0,0.3)]">
          <img
            className="h-12 cursor-pointer"
            src="https://www.cybermindworks.com/images/cmwlogo.svg"
            alt=""
          />
          {menuItems.map((item, ind) => (
            <li
              className="list-none cursor-pointer font-semibold hover:text-blue-600"
              key={ind}
            >
              {item}
            </li>
          ))}
          <Button
            className="px-6 py-2 text-white text-sm rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(161, 40, 255, 1), rgba(97, 0, 173, 1))",
              borderRadius: "9999px",
              border: "none",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            Create Jobs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 py-4 h-20 px-20 shadow-lg w-full">
        {/* Search Query */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-400 flex items-center gap-6">
          <img src="./search.png" className="h-4 w-4"></img>
          <input
            type="text"
            name="query"
            placeholder="Search By Job Title, Role"
            value={filters.query}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-400 flex items-center gap-6">
          <img src="./location.png" className="h-4 w-4"></img>
          <input
            type="text"
            name="location"
            placeholder="Preferred Location"
            value={filters.location}
            onChange={handleChange}
          />
        </div>

        {/* Job Type Dropdown */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-400 flex items-center gap-6">
          <img className="h-4" src="./job_type.png"></img>
          <select
            name="job_Type"
            value={filters.job_Type || ""}
            className={`w-[90%] ${filters.job_Type == ""? "text-black/50" : "text-black"}`}
            onChange={handleChange}
          >
            <option value="">Job Type</option>
            <option className="!text-black" value="Full-Time">Full Time</option>
            <option className="!text-black" value="Part-Time">Part Time</option>
            <option className="!text-black" value="Internship">Internship</option>
            <option className="!text-black" value="contract">contract</option>
          </select>
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
            min={10}
            max={500}
            step={1}
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
      {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
