"use client"
import { useEffect, useState } from "react";
import { Button, Modal, Grid } from "@mantine/core";
import { JobPost } from "@/lib/types";
import CustomDropdown from "./CustomDropdown";

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
  const Locations = [{label:"Chennai", value:"Chennai"}, {label:"Hyderabad", value:"Hyderabad"}, {label:"Delhi", value:"Delhi"}, {label:"Benguluru", value:"Benguluru"}];
  const JobTypes = [{label: "Full-time", value:"Full Time"}, {label:"Part-time", value:"Part Time"}, {label:"Contract", value:"Contract"}, {label:"Internship", value:"Internship"}];

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
    else{
      if(fieldName === "location"){
        setFocusedField("");
      }
      else if(fieldName === "job_type"){
        setFocusedField("");
      }
    }
  }

  const handleChange = (name: string, value: any) => {
    if(name === 'job_type'){
      if(value === 'Full Time'){
        value = "Full-time"
      }
      else if(value === 'Part Time'){
        value = 'Part-time'
      }
    }
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
      setSalaryErrorMessage("");

      if (isDraft) {
        localStorage.setItem("jobFormData", JSON.stringify(formData)); // Save draft
        // console.log(formData);
        alert("Draft saved successfully");
        return;
      }

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
              value={formData.company_name ?? ""}
              onFocus={() => handleFocus("company_name")}
              onBlur={() => handleBlur("company_name")}
              placeholder="Amazon, Tesla, Swiggy"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              className={`border ${errorMessage && !formData.company_name? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] p-2 rounded-lg`}/>
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <label className={`text-[18px] font-semibold ${formData.location || focusedField === "location"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Location</label>
          <div className={`border rounded-lg ${focusedField == "location"?'outline-2':''} ${errorMessage && !formData.location && focusedField !== "location"? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] `}>
            <CustomDropdown 
            placeholder="Choose Preferred Location "
            image="/DropDownArrow.png"
            val = {formData.location}
            options={Locations}
            onSelect={(value) => handleChange("location", value)}
            onFocus={() => handleFocus("location")}
            onBlur = {() => handleBlur("location")}
            />
          </div>
        </Grid.Col>

        <Grid.Col span={6}>
          <label className={`text-[18px] font-semibold ${formData.job_type || focusedField === "job_type"? 'text-black':'text-[rgba(0,0,0,0.5)]'}`}>Job Type</label>
          <div className={`border rounded-lg ${focusedField == "job_type"?'outline-2':''} ${errorMessage && !formData.job_type && focusedField !== "job_type" ? 'border-red-600':'border-[rgba(0,0,0,0.2)]'} h-[45] `}>
          <CustomDropdown 
          placeholder="Full Time  "
          image = "/DropDownArrow.png"
          val={formData.job_type}
          options={JobTypes}
          onSelect={(value) => handleChange("job_type", value)}
          onBlur={() => handleBlur("job_type")}
          onFocus={() => handleFocus("job_type")}
          />
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
          <div className="flex cursor-pointer relative flex-col">
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
              className={`border cursor-pointer h-[45] text-[18px] p-2 rounded-lg ${formData.application_deadline || focusedField === "application_deadline"? 'text-black':'text-[rgba(0,0,0,0)]'} ${errorMessage && !formData.application_deadline? 'border-red-600':'border-[rgba(0,0,0,0.2)]'}`} 
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
