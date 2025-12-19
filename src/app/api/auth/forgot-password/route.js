import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Simple password reset using a recovery answer (no email)
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email, recoveryAnswer, newPassword } = body;

    if (!email || !recoveryAnswer || !newPassword) {
      return NextResponse.json(
        { message: "Email, security answer and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or security answer" },
        { status: 400 }
      );
    }

    const storedAnswer = (user.recoveryAnswer || "").trim().toLowerCase();
    const providedAnswer = recoveryAnswer.trim().toLowerCase();

    if (!storedAnswer || storedAnswer !== providedAnswer) {
      return NextResponse.json(
        { message: "Invalid email or security answer" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save({ validateBeforeSave: false });

    return NextResponse.json(
      { message: "Password updated successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Forgot Password] Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


