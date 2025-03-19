// export interface Job {
//   job_id: number
//   job_title: string
//   job_mode: string
//   min_exp:number
//   max_exp:number
//   company_id: number
//   company_name: string
//   company_logo: string
//   job_type: string
//   salary_min: number
//   salary_max: number
//   location_id: number
//   city: string
//   job_description: string
//   application_deadline: string
//   requirements: string
//   responsibilities: string
//   created_at: string
// }

export interface JobPost{
  job_title: string
  company_name: string
  location: string
  job_type: string
  salary_min: number
  salary_max: number
  application_deadline: string
  job_description: string
  min_exp: number
  max_exp: number
  responsibilities: string
  requirements: string
}

export interface JobCard{
job_id:string
company_logo: string
created_at: string
job_title: string
min_exp: number
max_exp: number
job_mode: string
job_type: string
salary_max: number
job_description: string
}


export interface JobFilters{
  job_title: string
  location: string
  job_mode: string
  salary: number
}
// export interface CreateJobRequest {
//   job_title: string
//   company_name: string
//   location: string
//   job_type: string
//   salary_min: string
//   salary_max: string
//   application_deadline: string
//   job_description: string
//   requirements: string
//   responsibilities: string
//   is_draft: boolean
// }

