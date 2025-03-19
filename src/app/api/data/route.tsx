import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import type { JobPost } from "@/lib/types";
import { corsMiddleware } from "@/lib/cors";

// GET Route: Fetch Jobs with Company & Location Details
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = searchParams.get("query") || "";
    const locationParam = searchParams.get("location") || "";
    const jobTypeParam = searchParams.get("job_Type") || "";
    let salaryMinParam = searchParams.get("salary_Min") || 0;
    let salaryMaxParam = searchParams.get("salary_Max") || 0;
    salaryMinParam = salaryMinParam ? Number(salaryMinParam) * 12000 : 0;
    salaryMaxParam = salaryMaxParam ? Number(salaryMaxParam) * 12000 : 1;

    let queryString = `
      SELECT 
        j.job_id, 
        j.job_title, 
        c.company_logo,
        j.salary_max,
        j.job_type,
        l.city, 
        j.application_deadline, 
        j.job_description, 
        j.created_at,
        j.min_exp,
        j.max_exp
      FROM jobs j
      JOIN company_locations cl ON j.company_location_id = cl.id
      JOIN companies c ON cl.company_id = c.company_id
      JOIN locations l ON cl.location_id = l.location_id
    `;

    let params: any[] = [];
    let conditions: string[] = [];

    // Apply filters dynamically
    if (queryParam) {
      conditions.push(`(j.job_title ILIKE $${params.length + 1} OR c.company_name ILIKE $${params.length + 1})`);
      params.push(`%${queryParam}%`);
    }

    if (locationParam) {
      conditions.push(`l.city ILIKE $${params.length + 1}`);
      params.push(`%${locationParam}%`);
    }

    if (jobTypeParam && jobTypeParam !== "All") {
      conditions.push(`j.job_type ILIKE $${params.length + 1}`);
      params.push(`%${jobTypeParam}%`);
    }

    if (salaryMinParam) {
      conditions.push(`j.salary_min >= $${params.length + 1}`);
      params.push(Number(salaryMinParam));
    }

    if (salaryMaxParam) {
      conditions.push(`j.salary_max <= $${params.length + 1}`);
      params.push(Number(salaryMaxParam));
    }

    // If there are any conditions, append them to the query string
    if (conditions.length > 0) {
      queryString += " WHERE " + conditions.join(" AND ");
    }
    
    queryString += " ORDER BY j.created_at DESC";
    const result = await query(queryString, params);
  const response = NextResponse.json(result, { status: 200 });
  return corsMiddleware(response);

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST Route: Insert Job After Fetching/Inserting Company & Location
export async function POST(req: NextRequest) {
  try {
    await corsMiddleware(new NextResponse());
    const data = await req.json();

    const body: JobPost = data;
    const {
      job_title,
      company_name,
      location,
      job_type,
      salary_min,
      salary_max,
      application_deadline,
      job_description,
      min_exp,
      max_exp,
      responsibilities,
      requirements
    } = body;

    if (!job_title || !company_name || !location || !job_type  || min_exp == null || max_exp == null || !application_deadline || !job_description) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    // Fetch or Insert Company
    let companyResult = await query<{ company_id: number }>(
      "SELECT company_id FROM companies WHERE company_name = $1",
      [company_name]
    );
    let company_id = companyResult.length > 0 ? companyResult[0].company_id : (await query<{ company_id: number }>(
      "INSERT INTO companies (company_name) VALUES ($1) RETURNING company_id",
      [company_name]
    ))[0].company_id;

    // Fetch or Insert Location
    let locationResult = await query<{ location_id: number }>(
      "SELECT location_id FROM locations WHERE city = $1",
      [location]
    );
    let location_id = locationResult.length > 0 ? locationResult[0].location_id : (await query<{ location_id: number }>(
      "INSERT INTO locations (city) VALUES ($1) RETURNING location_id",
      [location]
    ))[0].location_id;

    // Fetch or Insert Company_Location
    let companyLocationResult = await query<{ id: number }>(
      "SELECT id FROM company_locations WHERE company_id = $1 AND location_id = $2",
      [company_id, location_id]
    );
    let company_location_id = companyLocationResult.length > 0 ? companyLocationResult[0].id : (await query<{ id: number }>(
      "INSERT INTO company_locations (company_id, location_id) VALUES ($1, $2) RETURNING id",
      [company_id, location_id]
    ))[0].id;

    // Insert Job
    await query(
      `INSERT INTO jobs (job_title, company_location_id, job_type, salary_min, salary_max, application_deadline, job_description, min_exp, max_exp,responsibilities, requirements)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        job_title,
        company_location_id,
        job_type,
        salary_min,
        salary_max,
        application_deadline,
        job_description,
        min_exp,
        max_exp,
        responsibilities,
        requirements
      ]
    );
    const response = NextResponse.json({ message: "Job added successfully" }, { status: 201 });
    return corsMiddleware(response); 
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to insert job" }, { status: 500 });
  }
}
