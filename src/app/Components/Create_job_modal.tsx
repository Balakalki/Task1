import { useState } from "react";
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
}

export default function CreateJobModal({ onClose }: CreateJobModalProps) {
  const [formData, setFormData] = useState({
    job_title: "",
    company_name: "",
    location: "",
    job_type: "",
    salary_min: 1,
    salary_max: 1000,
    min_exp: 0,
    max_exp: 1,
    job_mode: "Onsite",
    application_deadline: "",
    job_description: "",
    requirements: "as per job description",
    responsibilities: "complete tasks",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (isDraft: boolean) => {
      try {
        setIsSubmitting(true);
        await createJob({
          ...formData,
          salary_min: Number(formData.salary_min),
          salary_max: Number(formData.salary_max),
        });
        onClose();
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
      title={<div className="w-full text-center h-10 py-4 text-2xl font-semibold">Create Job Opening</div>}
      centered
      styles={{
        title: {
          width: '100%', // Ensure title takes full width of the modal
        },
      }}
    >
      <Grid gutter={"1rem"} className="px-10 pt-10">
        <Grid.Col span={6}>
          <TextInput
            label="Job Title"
            placeholder="Full Stack Developer, Developer"
            styles={{
              input: { height: "40px", fontSize: "16px" },
              label: { fontSize: "16px", fontWeight: "600", color: "#333" },
            }}
            value={formData.job_title}
            onChange={(e) => handleChange("job_title", e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Company Name"
            placeholder="Amazon, Microsoft, Swiggy"
            styles={{
              input: { height: "40px", fontSize: "16px" },
              label: { fontSize: "16px", fontWeight: "600", color: "#333" },
            }}
            value={formData.company_name}
            onChange={(e) => handleChange("company_name", e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <label className="block text-[16px] text-lg font-[600] text-[#333]">Location</label>
          <select
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={`w-[100%] border border-gray-300 h-[40] px-4 pr-5 text-lg rounded-sm ${
              formData.location === "" ? "text-gray-400" : "text-black"
            }`}
          >
            <option value="" disabled selected>
              Choose Preferred Location
            </option>
            <option className="text-black w-full" value="Remote">
              Remote
            </option>
            <option className="text-black w-full" value="Chennai">
              Chennai
            </option>
            <option className="text-black w-full" value="San Francisco">
              San Francisco
            </option>
            <option className="text-black w-full" value="New York">
              New York
            </option>
          </select>
        </Grid.Col>

        <Grid.Col span={6}>
          <label className="block text-[16px] text-lg font-[600] text-[#333]">Job Type</label>
          <select
            value={formData.job_type}
            onChange={(e) => handleChange("job_type", e.target.value)}
            className={`w-[100%] border rounded-sm border-gray-300 h-[40] px-4 pr-5 text-lg ${
              formData.job_type === "" ? "text-gray-400" : "text-black"
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
            <option className="text-black" value="freelance">
              Freelancer
            </option>
          </select>
        </Grid.Col>

        <Grid.Col span={3}>
          <label className="block text-[16px] text-lg font-[600] text-[#333]">Salary Min</label>
          <input
            type="number"
            value={formData.salary_min}
            onChange={(e) => handleChange("salary_min", e.target.value)}
            className="remove-arrow w-full focus:outline-none focus:ring-1 focus:ring-[#000000] h-[40] px-4 pr-5 text-lg rounded-sm border border-gray-300"
            style={{ fontSize: "16px" }}
          />
        </Grid.Col>

        <Grid.Col span={3}>
          <label className="block text-[16px] text-lg font-[600] text-[#333]">Salary Max</label>
          <input
            type="number"
            value={formData.salary_max}
            onChange={(e) => handleChange("salary_max", e.target.value)}
            className="w-full remove-arrow focus:outline-none focus:ring-1 focus:ring-[#000000] h-[40] px-4 pr-5 text-lg rounded-sm border border-gray-300"
            style={{ fontSize: "16px" }}
          />
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            type="date"
            styles={{
              input: { height: "40px", fontSize: "16px" },
              label: { fontSize: "16px", fontWeight: "600", color: "#333" },
            }}
            label="Application Deadline"
            value={formData.application_deadline}
            onChange={(e) => handleChange("application_deadline", e.target.value)}
          />
        </Grid.Col>

        <Grid.Col span={12}>
          <label htmlFor="message" className="block text-[16px] text-lg font-[600] text-[#333]">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.job_description}
            onChange={(e) => handleChange("job_description", e.target.value)}
            rows={5}
            className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#000000]"
            placeholder="Enter your message"
          ></textarea>
        </Grid.Col>

        <Grid.Col span={3}>
          <Button
            variant="outline"
            className="!h-10 !text-black !border-black shadow-2xl !flex justify-center items-baseline !text-md"
            fullWidth
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Save Draft
            <img className="pl-2 w-4 h-4 py-1" src="./draft.png" alt="" />
          </Button>
        </Grid.Col>

        <Grid.Col span={3} offset={6}>
          <Button
            fullWidth
            className="!h-10 !text-white shadow-2xl !flex justify-center items-baseline !text-lg"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
          >
            Publish
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
