import {Pool} from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

export async function query<T>(text:string, params?: any[]):Promise<T[]> {
    const client = await pool.connect();

    try{
        const res = await client.query(text, params);
        return res.rows;
    }finally{
        client.release();
    }
}



// INSERT INTO companies (company_Name)
// VALUES ('Google');

// ALTER TABLE locations
// ADD COLUMN company_ID INT REFERENCES companies(company_ID) ON DELETE CASCADE;

// SELECT * from companies;
// select * from locations;
// INSERT INTO locations (company_ID, city)
// VALUES (1,'chennai');


// ALTER TABLE jobs
// ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

// ALTER TABLE jobs
// ADD COLUMN salary_max INT check (salary_max > salary_min);


// INSERT INTO jobs 
// (job_Title, company_ID, job_Type, salary, location_ID, job_Description, application_Deadline, requirements, responsibilities)
// VALUES
// ('Software Engineere', 1, 'Full-time', 1000000, 1, 'We are hiring for software engineere Intern role', '2025-05-15', 'Job requirements are familiar with Java and worked with any backend technologies', 'Your role is to develop and deploy applications and websites')

// UPDATE jobs
// set salary_min = 800000, salary_max = 1000000
// where job_id = 1;

// SELECT * FROM jobs;