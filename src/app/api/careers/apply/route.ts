import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "You must be signed in to apply for a job" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { jobTitle, department, fullName, email, phone, resumeUrl, coverLetter, linkedIn, portfolio } = body

    // Validate required fields
    if (!jobTitle || !department || !fullName || !email) {
      return NextResponse.json(
        { error: "Missing required fields: jobTitle, department, fullName, email" },
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

    const application = await db.jobApplication.create({
      data: {
        userId: session.user.id,
        jobTitle,
        department,
        fullName,
        email,
        phone: phone || null,
        resumeUrl: resumeUrl || null,
        coverLetter: coverLetter || null,
        linkedIn: linkedIn || null,
        portfolio: portfolio || null,
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
