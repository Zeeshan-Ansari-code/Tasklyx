import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// GET all notifications for a user
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ notifications: [] }, { status: 200 });
    }

    const query = { user: userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .populate("relatedUser", "name email avatar")
      .populate("relatedTask", "title")
      .populate("relatedBoard", "title")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(); // Use lean() for better performance and to avoid Mongoose document issues

    // Fix malformed links in notifications
    const fixedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        try {
          // notification is already a plain object from lean()
          const notif = notification;
          
          if (notif.link) {
            // If link contains encoded object, try to extract the board ID from relatedBoard
            if (notif.link.includes('%') || notif.link.includes('ObjectId')) {
              let fixedLink = notif.link;
              
              // Try to extract board ID from relatedBoard if available
              if (notif.relatedBoard) {
                const boardId = notif.relatedBoard._id?.toString() || notif.relatedBoard?.toString() || notif.relatedBoard;
                
                // Reconstruct the link based on notification type
                if (notif.type === 'task_assigned' || notif.type === 'task_comment' || notif.type === 'task_deadline') {
                  const taskId = notif.relatedTask?._id?.toString() || notif.relatedTask?.toString() || notif.relatedTask;
                  fixedLink = `/boards/${boardId}${taskId ? `?task=${taskId}` : ''}`;
                } else if (notif.type === 'board_invite') {
                  fixedLink = `/boards/${boardId}`;
                }
              }
              
              // Update the notification in database if link was fixed
              if (fixedLink !== notif.link && notif._id) {
                await Notification.findByIdAndUpdate(notif._id, { link: fixedLink }).catch((err) => {
                  console.error("[Notifications API] Error updating notification link:", err);
                });
              }
              
              return { ...notif, link: fixedLink };
            }
          }
          return notif;
        } catch (err) {
          console.error("[Notifications API] Error processing notification:", err);
          // Return the notification as-is if there's an error processing it
          return notification;
        }
      })
    );

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return NextResponse.json(
      {
        notifications: fixedNotifications,
        unreadCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Notifications API] Error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// POST mark notifications as read
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, notificationIds } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Valid user ID is required" },
        { status: 400 }
      );
    }

    if (notificationIds && Array.isArray(notificationIds)) {
      // Mark specific notifications as read
      await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          user: userId,
        },
        { read: true }
      );
    } else {
      // Mark all notifications as read
      await Notification.updateMany(
        { user: userId, read: false },
        { read: true }
      );
    }

    return NextResponse.json(
      { message: "Notifications marked as read" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Notifications API] Error:", error);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

