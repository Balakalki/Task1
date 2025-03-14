"use client";
import React from "react";
import Image from "next/image";
import { Badge } from "@mantine/core";
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
  const timeAgo = dayjs.utc(jobData.created_at).subtract(5, 'hours').add(30, 'minutes').fromNow();

  return (
    <div className="max-w-80 bg-white shadow-lg rounded-2xl p-5 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        {jobData.company_logo && typeof jobData.company_logo === "string" ? (
          <Image
            src={jobData.company_logo ? `/${jobData.company_logo}` : "#"}
            alt="img"
            width={75}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        )}
        <Badge color="blue" size="sm">{timeAgo}</Badge>
      </div>

      {/* Job Title */}
      <h2 className="text-lg font-semibold mt-3">{jobData.job_title}</h2>

      {/* Job Details */}
      <div className="flex items-center text-gray-600 text-sm gap-2 mt-2">
        <img src="./experience.png" alt="img" className="h-3 w-4" />
        <span>{jobData.min_exp}-{jobData.max_exp} yr Exp</span>
        <img src="./Onsite.png" alt="img" className="h-3 w-4" />
        <span>{jobData.job_mode}</span>
        <img src="./LPA.png" alt="img" className="h-3 w-4" />
        <span className="bg-gray-200 px-2 py-1 rounded-md text-xs">{jobData.salary_max / 100000}LPA</span>
      </div>

      {/* Additional Job Details */}
      <ul className="text-sm text-gray-700 mt-3 list-disc pl-5">
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
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Apply Now
      </button>
    </div>
  );
};

export default JobCardCom;
