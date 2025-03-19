"use client";
import { useState, useEffect } from "react";
import { RangeSlider } from "@mantine/core";
import "@mantine/core/styles.css";
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
  onPosted: (status: boolean) => void;
}

export default function Header({ onSearch, onPosted }: SearchBoxProps) {
  const menuItems = ["Home", "Find Talents", "About us", "Testimonials"];
  const [range, setRange] = useState<[number, number]>([0, 500]);
  const [isModalOpen, setIsModalOpen] = useState(false);


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

          <div className="ml-6 group hover:bg-gray-100 rounded-md py-1 flex items-center px-2">
            <button
              style={{
                background:
                  "linear-gradient(to bottom, rgba(161, 40, 255, 1), rgba(97, 0, 173, 1))",
                borderRadius: "9999px",
                border: "none",
              }}
              onClick={() => setIsModalOpen(true)}
              className={`relative group-hover:scale-105 w-32 h-10 overflow-hidden rounded-lg bg-blue-600 text-white font-semibold`}
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
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-200 flex items-center gap-6">
          <img src="./location.png" className="h-6 w-5"></img>
          <div className="w-full relative">
            <select
              name="location"
              value={filters.location || ""}
              className={`w-[90%] pl-4 appearance-none ${filters.location == "" ? "text-black/50" : "text-black"}`}
              onChange={handleChange}
            >
              {/* <option value="">Location</option>
            <option className="!text-black" value="Full-Time">Chennai</option>
            <option className="!text-black" value="Part-Time">Hyderabad</option>
            <option className="!text-black" value="Internship">Internship</option>
            <option className="!text-black" value="contract">contract</option> */}
              <option value="">Preferred Location</option>
              <option className="text-black" value="Hyderabad">Hyderabad</option>
              <option className="text-black" value="Chennai">Chennai</option>
              <option className="text-black" value="Benguluru">Benguluru</option>
              <option className="text-black" value="Delhi">Delhi</option>
            </select>
            <img src="/Down 2.png" alt="" className="absolute right-8 w-3 top-3"
              style={{ pointerEvents: "none" }} />
          </div>
        </div>

        {/* Job Type Dropdown */}
        <div className="w-[25%] px-3 py-1 border-r-2 border-slate-200 flex items-center gap-6">
          <img className="h-5 w-5" src="./job_type.png"></img>
          <div className="w-full relative">
            <select
              name="job_Type"
              value={filters.job_Type || ""}
              className={`w-[90%] pl-4 appearance-none ${filters.job_Type == "" ? "text-black/50" : "text-black"}`}
              onChange={handleChange}
            >
              <option value="">Job Type</option>
              <option className="!text-black" value="Full-Time">Full Time</option>
              <option className="!text-black" value="Part-Time">Part Time</option>
              <option className="!text-black" value="Internship">Internship</option>
              <option className="!text-black" value="contract">contract</option>
            </select>
            <img src="/Down 2.png" alt="" className="absolute right-8 w-3 top-3"
              style={{ pointerEvents: "none" }} />
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
