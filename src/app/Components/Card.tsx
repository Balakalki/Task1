"use client";
import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { JobCard } from "@/lib/types";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

interface JobCardProps {
  jobData: JobCard;
}

const JobCardCom: React.FC<JobCardProps> = ({ jobData }) => {
  // const timeAgo = dayjs.utc(jobData.created_at).local().fromNow();
  const timeAgo = dayjs.utc(jobData.created_at).local().fromNow().replace(" minutes", "m").replace(" minute", "m").replace(" hours", "h").replace(" hour", "h").replace(" days", "d").replace(" day", "d").replace("ad","1d").replace("anh","1h").replace("am","1m").replace("ago", "Ago");


  return (
    <div className="w-80 h-[22rem] bg-white relative rounded-xl p-2 px-4 shadow border-gray-200">
      {/* Header */}
      <div className="flex relative items-center justify-between">
        {jobData.company_logo && typeof jobData.company_logo === "string" ? (
          <img className="w-24 object-cover" src={jobData.company_logo ? `/${jobData.company_logo}` : "#"} alt="" />
        ) : (
          
          <div className={`${jobData.company_logo === "companies/Tesla.png"? "w-20 h-20" : 'w-24 h-24'} flex items-center `}>
            <div className=" w-[50] h-[50] bg-gray-300 shadow-md rounded-sm">
            </div>
          </div>
        )}
        <div className=" bg-[rgba(172,217,255,1)] cursor-default absolute top-2 right-0 px-2 py-1 rounded-lg">{timeAgo}</div>
      </div>

      {/* Job Title */}
      <h2 className="text-xl w-fit cursor-pointer hover:text-blue-900 pb-1 font-semibold mt-3">{jobData.job_title}</h2>

      {/* Job Details */}
      <div className="flex items-center text-gray-600 text-sm justify-between pr-4 mt-2">
        <div className="flex items-center gap-1">
          <img src="./experience.png" alt="img" className="h-4 w-5" />
          <span className="font-semibold">{jobData.min_exp}-{jobData.max_exp} yr Exp</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="./Onsite.png" alt="img" className="h-4 w-5" />
          <span className="font-semibold">{jobData.job_type}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="./LPA.png" alt="img" className="h-4 w-5" />
          <span className="font-semibold">{jobData.salary_max / 100000}LPA</span>
        </div>
      </div>

      {/* Additional Job Details */}
      <ul className="text-sm h-[5.5rem] overflow-hidden text-gray-700 mt-3 list-disc pl-5">
        {jobData.job_description && typeof jobData.job_description === "string" && jobData.job_description.trim() !== "" ? (
          jobData.job_description
            .split(".")
            .filter((sentence) => sentence.trim() !== "")
            .map((sentence, index) => (
              <li key={index}>{sentence.trim()}.</li>
            ))
        ) : (
          <li>No description available</li>
        )}
      </ul>

      {/* Apply Button */}
      <button className="mt-4 w-full cursor-pointer bg-[rgba(0,170,255,1)] text-white py-2 rounded-lg transition">
        Apply Now
      </button>
    </div>
  );
};

export default JobCardCom;
