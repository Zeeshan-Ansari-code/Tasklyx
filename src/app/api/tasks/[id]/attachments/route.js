import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import mongoose from "mongoose";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request, { params }) {
  try {
    await connectDB();
    
    // In Next.js 16, params should be synchronous, but handle both cases
    let resolvedParams = params;
    if (params && typeof params.then === 'function') {
      resolvedParams = await params;
    }
    
    let id = resolvedParams?.id;
    
    // Handle array case (shouldn't happen but be safe)
    if (Array.isArray(id)) {
      id = id[0];
    }
    
    if (!id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    // Get user from formData or header
    const formData = await request.formData();
    const userId = formData.get("userId") || request.headers.get("x-user-id");
    
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 401 }
      );
    }

    // Validate ObjectId
    if (id.length !== 24 || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task ID format" },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: "File size exceeds 10MB limit" },
        { status: 400 }
      );
    }

    // Validate file type (optional - allow common file types)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "File type not allowed" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "attachments");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}_${sanitizedName}`;
    const filepath = join(uploadsDir, filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Create file URL
    const fileUrl = `/uploads/attachments/${filename}`;

    // Add attachment to task
    task.attachments.push({
      name: file.name,
      url: fileUrl,
      uploadedAt: new Date(),
    });

    await task.save();

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        attachment: {
          name: file.name,
          url: fileUrl,
          uploadedAt: task.attachments[task.attachments.length - 1].uploadedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[File Upload] Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    // In Next.js 16, params should be synchronous, but handle both cases
    let resolvedParams = params;
    if (params && typeof params.then === 'function') {
      resolvedParams = await params;
    }
    
    let id = resolvedParams?.id;
    
    // Handle array case (shouldn't happen but be safe)
    if (Array.isArray(id)) {
      id = id[0];
    }
    
    if (!id) {
      return NextResponse.json(
        { message: "Task ID is required" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const attachmentUrl = searchParams.get("url");

    if (!attachmentUrl) {
      return NextResponse.json(
        { message: "Attachment URL required" },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (id.length !== 24 || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid task ID format" },
        { status: 400 }
      );
    }

    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json(
        { message: "Task not found" },
        { status: 404 }
      );
    }

    // Remove attachment from task
    task.attachments = task.attachments.filter(
      (att) => att.url !== attachmentUrl
    );
    await task.save();

    // Optionally delete file from disk
    try {
      const { unlink } = await import("fs/promises");
      const { join } = await import("path");
      const filepath = join(process.cwd(), "public", attachmentUrl);
      if (existsSync(filepath)) {
        await unlink(filepath);
      }
    } catch (fileError) {
      // File deletion is non-critical, just log it
      console.warn("[File Upload] Failed to delete file:", fileError);
    }

    return NextResponse.json(
      { message: "Attachment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[File Upload] Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

