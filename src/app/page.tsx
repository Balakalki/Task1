"use client";
import { useState, useEffect } from "react";
import { JobCard } from "@/lib/types";
import Header from "./Components/Header";
import Card from "./Components/Card";

export default function Home() {
  const [data, setData] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    query: "",
    location: "",
    job_Type: "",
    salary_Min: 0,
    salary_Max: 1000000,
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(
        Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== "" && value !== 0) {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data?${queryParams}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const result: JobCard[] = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };
  const OnPost = (onpost:boolean) =>{
    if(onpost){
      fetchJobs();
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [filters]); // Triggers fetch only when filters change

  return (
    <>
      <Header onSearch={setFilters} onPosted = {OnPost}/>
      <div className="p-4 bg-[rgba(251,251,255,1)] flex justify-center">
        {loading ? (
          <p>Loading jobs...</p>
        ) : data.length === 0 ? (
          <p>No jobs found</p> // Handle the case where no jobs are returned
        ) : (
          <div className="grid [@media(min-width:1330px)]:grid-cols-4 gap-5 [@media(min-width:1000px)]:grid-cols-3  sm:grid-cols-2 gird-cols-1 pt-10">
            {data.map((job) => (
              <div key={job.job_id}>
                <Card jobData={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}




