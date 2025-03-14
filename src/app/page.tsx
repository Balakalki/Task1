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
      const result: JobCard[] = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    fetchJobs();
  }, [JSON.stringify(filters)]); // Ensures `filters` changes trigger fetch only when values change

  return (
    <>
      <Header onSearch={setFilters}/>
      <div className="p-4 flex justify-center sm:px-[7%]">
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <ul className="flex flex-wrap gap-10">
            {data.map((job) => (
              <li key={job.job_id}>
                <Card jobData={job} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
















// "use client";
// import { useState, useEffect } from "react";
// import { Job } from "@/lib/types";
// import Header from "./Components/Header";
// // import Head from "next/head";


// // interface Data {
// //   job_id: number;
// //   job_title: string;
// //   company_id:number;
// //   job_type: string;
// //   salary: number;
// //   location_id: string;
// //   job_description: string;
// //   application_deadline: string;
// //   requirements: string;
// //   responsibilities: string;
// //   created_at: string;
// // }

// export default function Home() {
//   const [data, setData] = useState<Job[]>([]);
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [loading, setLoading] = useState(true)
//   const [formData, setFormData] = useState({
//     job_Title: "",
//     company_Name: "",
//     job_Type: "",
//     salary: "",
//     city: "",
//     job_Description: "",
//     application_Deadline: "",
//     requirements: "",
//     responsibilities: "",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const res = await fetch("http://localhost:3000/api/data");
//         const result: Job[] = await res.json();
//         // console.log("Fetched Data:", result);
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }finally {
//         setLoading(false)
//       }
//     };

//     fetchData();
//   }, []);
  

//   useEffect(() => {
//     // Construct query parameters
//     const queryParams = new URLSearchParams();
//     if (searchQuery) queryParams.append("query", searchQuery);
//     if (location) queryParams.append("location", location);
//     if (jobType) queryParams.append("jobType", jobType);
//     if (salary) queryParams.append("salary", salary);

//     if (queryParams.toString()) {
//       fetch(`/api/search?${queryParams.toString()}`)
//         .then((res) => res.json())
//         .then((data) => console.log("Search Results:", data));
//     }
//   }, [searchQuery, location, jobType, salary]);

//   // const fetchJobs = async () => {
//   //   try {
//   //     // setLoading(true)
//   //     const jobsData = await getJobs()
//   //     console.log("async ",jobsData);
//   //     setData(jobsData)
//   //   } catch (error) {
//   //     console.error("Failed to fetch jobs:", error)
//   //   } finally {
//   //     // setLoading(false)
//   //   }
//   // }
//   data.forEach((dat)=>{
//     console.log("data is ", dat);
//   })
  
//   // const handleJobCreated = () => {
//   //   fetchJobs()
//   //   setIsModalOpen(false)
//   // }


//   return (
//     <>
//       <Header onSearch={}/>
//       <div className="text-red-500 bg-">
//         <ul>
//         {data.map((data) =>(
//           <li key = {data.job_id}>{data.job_id} -- {data.job_title}</li>
//         ))}
//         </ul>
//       </div>
//     </>
//   );
// }
