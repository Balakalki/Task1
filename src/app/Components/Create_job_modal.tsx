"use client"
import { useEffect, useState } from "react";
import { Button, TextInput, Select, Modal, Grid, Textarea } from "@mantine/core";
import { JobPost } from "@/lib/types";

async function createJob(jobData: JobPost) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/data`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) throw new Error(`Failed to create job: ${response.status}`);
  return response.json();
}

interface CreateJobModalProps {
  onClose: () => void;
  isPosted: (status: boolean) => void;
}

export default function CreateJobModal({ onClose, isPosted }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    job_type: "",
    salary_min: null,
    salary_max: null,
    min_exp: 0,
    max_exp: 1,
    application_deadline: "",
    job_description: "",
    requirements: "as per job description",
    responsibilities: "complete tasks",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [salaryErrorMessage, setSalaryErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = localStorage.getItem("jobFormData");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const handleFocus = (fieldName : string) =>{
    setFocusedField(fieldName);
  };

  const handleBlur = (fieldName : keyof typeof formData) =>{
    if(!formData[fieldName]){
      setFocusedField("");
    }
  }

  const handleChange = (name: string, value: any) => {
    if((name === "salary_min" || name === "salary_max") && value < 0){
      setSalaryErrorMessage("salary can not be negative");
    }
    else{
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  
  const handleSubmit = async (isDraft: boolean) => {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const jobData = {
        ...formData,
        salary_min: Number(formData.salary_min),
        salary_max: Number(formData.salary_max),
      };
      const requiredFields: (keyof JobPost)[] = [
        "job_title",
        "company_name",
        "location",
        "job_type",
        "salary_min",
        "salary_max",
        "application_deadline",
        "job_description",
      ];

      const missingFields = requiredFields.filter((field) => !jobData[field]);
      if (missingFields.length > 0) {
        setErrorMessage("All required fields must be filled");
        return;
      }
      else{
        if(jobData.salary_max < jobData.salary_min){
          setErrorMessage("slary min must be less than salary max");
          return;
        }
        if (isDraft) {
          localStorage.setItem("jobFormData", JSON.stringify(jobData)); // ✅ Save draft
          alert("Draft saved successfully");
        } else {
          await createJob(jobData);
          localStorage.removeItem("jobFormData");
          setSuccessMessage("Job posted Successfully");
          isPosted(true);

          setFormData({
            job_title: "",
            company_name: "",
            location: "",
            job_type: "",
            salary_min: null,
            salary_max: null,
            min_exp: 0,
            max_exp: 1,
            application_deadline: "",
            job_description: "",
            requirements: "as per job description",
            responsibilities: "complete tasks",
          });
        }
      }
    } catch (error) {
      console.error("Failed to create job:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened
      onClose={onClose}
      size={800}
      withCloseButton={false}
      radius={20}
      title={<div className="w-full text-center h-5 pb-8 text-2xl font-semibold">Create Job Opening</div>}
      centered
      styles={{
        title: {
          width: '100%',
        },
      }}
    >
      {successMessage && <div className="flex justify-center"><p className="text-green-800">{successMessage}</p></div>}
      {errorMessage && <div className="flex justify-center"><p className="text-red-500">{errorMessage}</p></div>}
      {!errorMessage && salaryErrorMessage && <div className="flex justify-center"><p className="text-red-500">{salaryErrorMessage}</p></div>}
      <Grid gutter={"1rem"} className="px-10 pt-7">
        <Grid.Col span={6}>
          <div className="flex flex-col">
            <label className={`text-[18px] font-semibold ${formData.job_title || focusedField === "job_title"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Job Title</label>
            <input type="text"
              name="job_title"
              value={formData.job_title}
              onFocus={() => handleFocus("job_title")}
              onBlur={() => handleBlur("job_title")}
              placeholder="Full Stack Developer, SDE"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={`border ${errorMessage && !formData.job_title? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} p-2 h-[45] text-[18px] rounded-lg`} />
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className="flex flex-col">
            <label className={`text-[18px] font-semibold ${formData.company_name || focusedField === "company_name"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Company Name</label>
            <input type="text"
              name="company_name"
              value={formData.company_name}
              onFocus={() => handleFocus("company_name")}
              onBlur={() => handleBlur("company_name")}
              placeholder="Amazon, Tesla, Swiggy"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={`border ${errorMessage && !formData.company_name? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] p-2 rounded-lg`}/>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <label className={`text-[18px] font-semibold ${formData.location || focusedField === "location"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Location</label>
          <div className="relative">
            <select
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            onFocus={() => handleFocus("location")}
            onBlur={() => handleBlur("location")}
            className={`w-[100%] appearance-none border ${errorMessage && !formData.location? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] px-4 text-lg rounded-lg ${formData.location === "" ? "text-gray-400" : "text-black"
              }`}
          >
            <option value="" disabled selected>
              Choose Preferred Location
            </option>
            <option className="text-black w-full" value="Hyderabad">
              Hyderabad
            </option>
            <option className="text-black w-full" value="Chennai">
              Chennai
            </option>
            <option className="text-black w-full" value="Benguluru">
              Benguluru
            </option>
            <option className="text-black w-full" value="Delhi">
              Delhi
            </option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <img src="/DropDownArrow.png" alt="" />
          </div>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <label className={`text-[18px] font-semibold ${formData.job_type || focusedField === "job_type"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Job Type</label>
          <div className="relative">
          <select
            required
            value={formData.job_type}
            onChange={(e) => handleChange("job_type", e.target.value)}
            onFocus={() => handleFocus("job_type")}
            onBlur={() => handleBlur("job_type")}
            className={`w-[100%] border appearance-none rounded-lg ${errorMessage && !formData.job_type? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] px-4 text-lg ${formData.job_type === "" ? "text-gray-400" : "text-black"
              }`}
          >
            <option value="" disabled selected>
              Enter Job Type
            </option>
            <option className="text-black" value="Full-time">
              Full Time
            </option>
            <option className="text-black" value="Part-time">
              Part Time
            </option>
            <option className="text-black" value="Contract">
              Contract
            </option>
            <option className="text-black" value="Internship">
              Internship
            </option>
          </select>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <img src="/DropDownArrow.png" alt="" />
          </div>
          </div>
        </Grid.Col>

        <Grid.Col span={3}>
          <label className={`text-[18px] font-semibold ${formData.salary_min || focusedField === "salary_min"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Salary Min</label>
          <div className="relative">
            <div
            style={{ pointerEvents: "none" }}
            className={`${formData.salary_min || focusedField === "salary_min"? 'hidden':''} flex gap-2 items-center absolute left-2 top-1/2 transform -translate-y-1/2`}>

              <img
                className="w-4 h-4"
                src="/salary_indicator.png"
                alt="icon"
              />
              <p className="text-[rgba(0,0,0,0.25)] font-semibold">₹0</p>
            </div>
            <input
              type="number"
              value={formData.salary_min ?? ""}
              onFocus={() => handleFocus("salary_min")}
              onBlur={() => handleBlur("salary_min")}
              onChange={(e) => handleChange("salary_min", e.target.value)}
              className={`relativ z-10 remove-arrow w-full h-[45] px-4 pr-5 text-lg rounded-lg border ${(errorMessage || salaryErrorMessage) && !formData.salary_min? 'border-red-600':'border-[rgba(0,0,0,0.2)]'}`}
              style={{ fontSize: "16px" }}
            />
          </div>
        </Grid.Col>

        <Grid.Col span={3}>
          <label className={`text-[18px] font-semibold ${formData.salary_max || focusedField === "salary_max"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Salary Max</label>
          <div className="relative" >
            <div className={`${formData.salary_max || focusedField === "salary_max"? 'hidden':''} flex gap-2 items-center absolute left-2 top-1/2 transform -translate-y-1/2`}
            style={{ pointerEvents: "none" }}
            >
              <img
                className="w-4 h-4"
                src="/salary_indicator.png"
                alt="icon"
              />
              <p className="text-[rgba(0,0,0,0.25)] font-semibold">₹12,00,000</p>
            </div>
            <input
              type="number"
              value={formData.salary_max ?? ""}
              onChange={(e) => handleChange("salary_max", e.target.value)}
              onFocus={() => handleFocus("salary_max")}
              onBlur={() => handleBlur("salary_max")}
              className={`w-full remove-arrow h-[45] px-4 pr-5 text-lg rounded-lg border ${(errorMessage || salaryErrorMessage) && !formData.salary_max? 'border-red-600':'border-[rgba(0,0,0,0.2)]'}`}
              style={{ fontSize: "16px" }}
            />
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <div className="flex relative flex-col">
            <label className={`text-[18px] font-semibold ${formData.application_deadline || focusedField === "application_deadline"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Application Deadline</label>
            <input type="date"
              name="application_deadline"
              value={formData.application_deadline}
              onChange={(e) => { handleChange(e.target.name, e.target.value) }}
              onFocus={(e) => {
                e.target.showPicker();  // Opens date picker when clicked
                handleFocus("application_deadline");
              }}
              onBlur={() => handleBlur("application_deadline")}
              className={`border h-[45] text-[18px] p-2 rounded-lg ${formData.application_deadline || focusedField === "application_deadline"? 'text-black':'text-[rgba(0,0,0,0)]'} ${errorMessage && !formData.application_deadline? 'border-red-600':'border-[rgba(0,0,0,0.2)]'}`} 
              style={{appearance:"none"}}/>
              <img src="/DateIcon.png" className="h-4 w-4 absolute top-11 right-4" alt="" />
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <label className={`text-[18px] font-semibold ${formData.job_description || focusedField === "job_description"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>
            Job Description
          </label>
          <textarea
            name="job_description"
            value={formData.job_description}
            onChange={(e) => handleChange("job_description", e.target.value)}
            onFocus={() => handleFocus("job_description")}
            onBlur={() => handleBlur("job_description")}
            rows={5}
            className={`w-full h-30 p-3 mt-1 border ${errorMessage && !formData.job_description? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} rounded-lg`}
            placeholder="Please share a description to let the candidate know more about the job role"
          ></textarea>
        </Grid.Col>

        <Grid.Col span={3}>
          <Button
            variant="outline"
            className="!h-13 !w-60 !text-[18px] !text-black !border-black shadow-2xl !flex justify-center items-baseline !text-md"
            fullWidth
            radius={"md"}

            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Save Draft
            <img className="pl-2 w-4 h-4 py-1" src="./draft.png" alt="" />
          </Button>
        </Grid.Col>

        <Grid.Col span={3} offset={5}>
          <Button
            fullWidth
            radius={'md'}
            className="!h-13 !w-50 !text-white shadow-2xl !flex justify-center items-baseline !font-normal !text-[18px]"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            Publish
            <img className="pl-3 w-6 h-3" src="./publish.png" alt="" />
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
