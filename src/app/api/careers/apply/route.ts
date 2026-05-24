import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { put } from "@vercel/blob"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"]

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".")
  return lastDot >= 0 ? filename.substring(lastDot).toLowerCase() : ""
}

// Convert empty strings to null for optional fields
function cleanOptional(value: string | null | undefined): string | null {
  if (!value || value.trim() === "") return null
  return value.trim()
}

export async function POST(req: NextRequest) {
  try {
    // Step 1: Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to apply for a job" },
        { status: 401 }
      )
    }

    // Step 2: Parse form data
    let formData: FormData
    try {
      formData = await req.formData()
    } catch (formError) {
      console.error("FormData parse error:", formError)
      return NextResponse.json(
        { error: "Failed to parse form data. Please try again." },
        { status: 400 }
      )
    }

    // Step 3: Extract and validate fields
    const jobTitle = (formData.get("jobTitle") as string)?.trim() || ""
    const department = (formData.get("department") as string)?.trim() || ""
    const fullName = (formData.get("fullName") as string)?.trim() || ""
    const email = (formData.get("email") as string)?.trim() || ""
    const phone = cleanOptional(formData.get("phone") as string)
    const coverLetter = cleanOptional(formData.get("coverLetter") as string)
    const linkedIn = cleanOptional(formData.get("linkedIn") as string)
    const portfolio = cleanOptional(formData.get("portfolio") as string)
    const cvFile = formData.get("cv") as File | null

    if (!jobTitle || !department || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, department, fullName, email" },
        { status: 400 }
      )
    }

    // Step 4: Validate CV file
    if (!cvFile || cvFile.size === 0) {
      return NextResponse.json(
        { error: "Please upload your CV / Resume" },
        { status: 400 }
      )
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "CV file size must be less than 5MB" },
        { status: 400 }
      )
    }

    const ext = getFileExtension(cvFile.name)
    const isAllowedType = ALLOWED_TYPES.includes(cvFile.type) || ALLOWED_EXTENSIONS.includes(ext)
    if (!isAllowedType) {
      return NextResponse.json(
        { error: "CV must be a PDF, DOC, or DOCX file" },
        { status: 400 }
      )
    }

    // Step 5: Check for duplicate application
    try {
      const existingApplication = await db.jobApplication.findFirst({
        where: {
          userId: session.user.id,
          jobTitle,
        },
      })

      if (existingApplication) {
        return NextResponse.json(
          { error: "You have already applied for this position" },
          { status: 409 }
        )
      }
    } catch (dbCheckError) {
      console.error("Duplicate check error:", dbCheckError)
      // Continue anyway - better to allow duplicate than block all applications
    }

    // Step 6: Upload CV to Vercel Blob
    let resumeUrl: string | null = null
    try {
      const blob = await put(`cvs/${session.user.id}/${Date.now()}-${cvFile.name}`, cvFile, {
        access: "public",
        contentType: cvFile.type || "application/octet-stream",
      })
      resumeUrl = blob.url
    } catch (blobError) {
      console.error("Blob upload failed, saving application without file:", blobError)
    }

    // Step 7: Create application in database
    let application
    try {
      application = await db.jobApplication.create({
        data: {
          userId: session.user.id,
          jobTitle,
          department,
          fullName,
          email,
          phone,
          resumeUrl,
          coverLetter,
          linkedIn,
          portfolio,
        },
      })
    } catch (dbCreateError: unknown) {
      console.error("Database create error:", dbCreateError)
      const errorMessage = dbCreateError instanceof Error ? dbCreateError.message : "Unknown database error"
      return NextResponse.json(
        { error: `Failed to save application: ${errorMessage}` },
        { status: 500 }
      )
    }

    if (!resumeUrl) {
      return NextResponse.json(
        { message: "Application submitted, but CV upload failed. Please contact support.", application, cvWarning: true },
        { status: 201 }
      )
    }

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("Job application POST error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Internal server error: ${errorMessage}` },
      { status: 500 }
    )
  }
}
