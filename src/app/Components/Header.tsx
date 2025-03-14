"use client";

import "@mantine/core/styles.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { RangeSlider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Button } from "@mantine/core";
import CreateJobModal from "./Create_job_modal";

interface SearchBoxProps {
  onSearch: (filters: {
    query: string;
    location: string;
    job_Type: string;
    salary_Min: number;
    salary_Max: number;
  }) => void;
}

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const menuItems = ["Home", "Find Talents", "About us", "Testimonials"];
  const [range, setRange] = useState<[number, number]>([10, 110000]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    job_Type: "",
    salary_Min: 10,
    salary_Max: 110000,
  });

  useEffect(() => {
    onSearch(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSalaryChange = (newRange: [number, number]) => {
    setFilters((prev) => ({
      ...prev,
      salary_Min: newRange[0],
      salary_Max: newRange[1],
    }));
    setRange(newRange);
  };

  return (
<<<<<<< HEAD
    <div className="flex flex-col items-center w-full p-4 bg-white shadow-lg">
      {/* Top Navigation */}
      <div className="w-full flex justify-between items-center px-4 md:px-10">
        <Image
          className="h-14 w-auto"
          src="https://www.cybermindworks.com/images/cmwlogo.svg"
          alt="Logo"
          width={100}
          height={40}
        />
        {/* Responsive Menu */}
        <div className="hidden lg:flex space-x-8 text-gray-700 font-semibold">
          {menuItems.map((item) => (
            <a key={item} className="cursor-pointer hover:text-indigo-600 transition">
=======
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
>>>>>>> 4cde2598c7aa93dd4e12d7625729eae31df7a1d6
              {item}
            </a>
          ))}
        </div>
        <Button
          className="hidden lg:block px-6 py-2 text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full"
          onClick={() => setIsModalOpen(true)}
        >
          Post a Job
        </Button>
      </div>

      {/* Search Filters */}
      <div className="flex flex-wrap justify-between items-center w-full gap-4 md:px-20 px-4 py-4 bg-gray-50 shadow-md">
        {/* Search Input */}
        <div className="w-full md:w-1/4 flex items-center gap-3 border rounded-full px-4 py-2 bg-white">
          <Image src="/search-icon.svg" alt="Search" width={14} height={14} />
          <input
            type="text"
            name="query"
            placeholder="Search By Job Title"
            value={filters.query}
            onChange={handleInputChange}
            className="w-full border-none outline-none bg-transparent"
          />
        </div>

        {/* Location Input */}
        <div className="w-full md:w-1/4 flex items-center gap-2 border-r-2 border-gray-200 pr-4">
          <Image src="/location.png" alt="Location" width={16} height={16} />
          <input
            type="text"
            name="location"
            placeholder="Enter Location"
            value={filters.location}
            onChange={handleInputChange}
            className="flex-1 outline-none bg-transparent"
          />
        </div>

        {/* Job Type Selection */}
        <select
          name="job_Type"
          value={filters.job_Type}
          onChange={handleInputChange}
          className="w-full md:w-1/4 p-2 border border-gray-300 rounded-md"
        >
          <option value="">Job Type</option>
          <option value="Full-Time">Full Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

<<<<<<< HEAD
        {/* Salary Range */}
        <div className="w-full md:w-1/4 flex flex-col">
          <p className="text-sm font-semibold">Salary Per Month</p>
=======
        {/* Salary Range Slider (Single Line) */}
        <div className="w-[25%] px-3 py-1 gap-2 flex flex-col">
          <div className="flex justify-between font-semibold">
            <p>Salary Per Month</p>
            <p className="">₹{range[0]}k - ₹{range[1]}k</p>
          </div>
>>>>>>> 4cde2598c7aa93dd4e12d7625729eae31df7a1d6
          <RangeSlider
            value={range}
            onChange={handleSalaryChange}
            min={10}
            max={500}
            step={1}
            className="px-2"
          />
          <div className="flex justify-between text-xs">
            <span>{range[0]}</span>
            <span>{range[1]}</span>
          </div>
        </div>
      </div>

      {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}













// "use client";
// import { useState, useEffect } from "react";
// import { RangeSlider } from "@mantine/core";
// import "@mantine/core/styles.css";
// import { Button } from "@mantine/core";
// import CreateJobModal from "./Create_job_modal";
// import classes from "./SliderLabel.module.css";

// interface SearchBoxProps {
//   onSearch: (filters: {
//     query: string;
//     location: string;
//     job_Type: string;
//     salary_Min: number;
//     salary_Max: number;
//   }) => void;
// }

// export default function Header({ onSearch }: SearchBoxProps) {
//   const menuItems = ["Home", "Find Talents", "About us", "Testimonials"];
//   const [range, setRange] = useState<[number, number]>([50, 80]);
//   const [isModalOpen, setIsModalOpen] = useState(false)

  
//   const [filters, setFilters] = useState({
//     query: "",
//     location: "",
//     job_Type: "",
//     salary_Min: 0,
//     salary_Max: 1100000,
//   });

//   const handleChange = (
//     event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = event.target;
  
//     setFilters((prev) => {
//       let updatedFilters = { ...prev, [name]: value };
  
//       return updatedFilters;
//     });
//   };
//   const handleSalaryChange = (newRange: [number, number]) => {
//     const [newMin, newMax] = newRange;

//     // Ensure salary_Min is never greater than salary_Max
//     const updatedSalaryMin = newMin >= newMax ? newMax - 1 : newMin;
//     const updatedSalaryMax = newMax <= updatedSalaryMin ? updatedSalaryMin + 1 : newMax;

//     // Update the filters state with new salary values
//     setFilters((prev) => ({
//       ...prev,
//       salary_Min: updatedSalaryMin,
//       salary_Max: updatedSalaryMax,
//     }));
//     setRange([newMin, newMax]);
//   }
  
//   // Use useEffect to call onSearch only after filters are updated
//   useEffect(() => {
//     onSearch(filters);
//   }, [filters]); // Runs every time filters change

//   return (
//     <div className="w-full flex flex-col">
//       {/* Top Header */}
//       <div className="flex py-5  w-full justify-center">
//         <div className="px-10 items-center w-[60%] flex justify-between h-14 bg-white rounded-[2.5rem] shadow-[0px_0px_20px_rgba(0,0,0,0.3)]">
//           <img
//             className="h-12 cursor-pointer"
//             src="https://www.cybermindworks.com/images/cmwlogo.svg"
//             alt=""
//           />
//           {menuItems.map((item, ind) => (
//             <li
//               className="list-none cursor-pointer font-semibold hover:text-blue-600"
//               key={ind}
//             >
//               {item}
//             </li>
//           ))}
//           <Button
//             className="px-6 py-2 text-white text-sm rounded-full"
//             style={{
//               background:
//                 "linear-gradient(to bottom, rgba(161, 40, 255, 1), rgba(97, 0, 173, 1))",
//               borderRadius: "9999px",
//               border: "none",
//             }}
//             onClick={() => setIsModalOpen(true)}
//           >
//             Create Jobs
//           </Button>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex gap-0 [@media:min-width: 1175]:gap-4 py-4 h-20 [@media:min-width: 1175]:px-20 shadow-lg w-full">
//         {/* Search Query */}
//         <div className="[@media:min-width: 1175]:w-[25%] w-[20%] px-3 py-1 border-r-2 border-slate-400 flex items-center overflow-hidden mr-4 [@media:min-width: 1175]:gap-6">
//           <img src="./search.png" className="h-4 w-4"></img>
//           <input
//             type="text"
//             name="query"
//             placeholder="Search By Job Title, Role"
//             value={filters.query}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Location */}
//         <div className="[@media:min-width: 1175]:w-[25%] w-[20%] px-3 py-1 border-r-2 border-slate-400 flex items-center overflow-hidden mr-4 [@media:min-width: 1175]:gap-6">
//           <img src="./location.png" className="h-4 w-4"></img>
//           <input
//             type="text"
//             name="location"
//             placeholder="Preferred Location"
//             value={filters.location}
//             onChange={handleChange}
//           />
//         </div>

//         {/* Job Type Dropdown */}
//         <div className="[@media:min-width: 1175]:w-[25%] w-[20%] px-3 py-1 border-r-2 border-slate-400 flex items-center overflow-hidden mr-4 [@media:min-width: 1175]:gap-6">
//           <img className="h-4" src="./job_type.png"></img>
//           <select
//             name="job_Type"
//             value={filters.job_Type || ""}
//             className={`w-[90%] ${filters.job_Type == ""? "text-black/50" : "text-black"}`}
//             onChange={handleChange}
//           >
//             <option value="">Job Type</option>
//             <option className="!text-black" value="Full-Time">Full Time</option>
//             <option className="!text-black" value="Part-Time">Part Time</option>
//             <option className="!text-black" value="Internship">Internship</option>
//             <option className="!text-black" value="contract">contract</option>
//           </select>
//         </div>

//         {/* Salary Range Slider (Single Line) */}
//         <div className="w-[25%] px-3 py-1 gap-2 flex flex-col">
//           <div className="flex justify-between font-semibold">
//             <p>Salary Per Month</p>
//             <p className="">₹{range[0]}k - ₹{range[1]}k</p>
//           </div>
//           <RangeSlider
//             value={range}
//             onChange={handleSalaryChange}
//             min={10}
//             max={500}
//             step={1}
//             classNames={{
//               thumb: classes.thumb,
//               label: classes.label,
//               track: classes.track,
//               bar: classes.bar,
//             }}
//             labelAlwaysOn
//             label={null}
//             className="px-2"
//           />
//         </div>
//       </div>
//       {isModalOpen && <CreateJobModal onClose={() => setIsModalOpen(false)} />}
//     </div>
//   );
// }