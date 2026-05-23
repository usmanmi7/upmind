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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to apply for a job" },
        { status: 401 }
      )
    }

    // Parse multipart form data
    const formData = await req.formData()
    const jobTitle = formData.get("jobTitle") as string
    const department = formData.get("department") as string
    const fullName = formData.get("fullName") as string
    const email = formData.get("email") as string
    const phone = (formData.get("phone") as string) || null
    const coverLetter = (formData.get("coverLetter") as string) || null
    const linkedIn = (formData.get("linkedIn") as string) || null
    const portfolio = (formData.get("portfolio") as string) || null
    const cvFile = formData.get("cv") as File | null

    // Validate required fields
    if (!jobTitle || !department || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, department, fullName, email" },
        { status: 400 }
      )
    }

    // Validate CV file
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

    if (!ALLOWED_TYPES.includes(cvFile.type)) {
      return NextResponse.json(
        { error: "CV must be a PDF, DOC, or DOCX file" },
        { status: 400 }
      )
    }

    // Check if user already applied for this job
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

    // Upload CV to Vercel Blob
    const blob = await put(`cvs/${session.user.id}/${Date.now()}-${cvFile.name}`, cvFile, {
      access: "public",
      contentType: cvFile.type,
    })

    const application = await db.jobApplication.create({
      data: {
        userId: session.user.id,
        jobTitle,
        department,
        fullName,
        email,
        phone,
        resumeUrl: blob.url,
        coverLetter,
        linkedIn,
        portfolio,
      },
    })

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 }
    )
  } catch (error) {
    console.error("Job application POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
