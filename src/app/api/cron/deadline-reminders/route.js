import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Task from "@/models/Task";
import { notifyDeadlineApproaching } from "@/lib/notifications";

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions, etc.)
// Recommended: Run every 6 hours to check for approaching deadlines
export async function POST(request) {
  try {
    await connectDB();

    // Verify cron secret if provided
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Find tasks with due dates approaching (within 24-48 hours)
    // This prevents duplicate notifications by only notifying once
    const tasks = await Task.find({
      dueDate: {
        $gte: in24Hours,
        $lte: in48Hours,
      },
      completed: false,
      assignees: { $exists: true, $ne: [] },
    })
      .populate("board", "_id title")
      .populate("assignees", "_id email emailNotifications notificationPreferences");

    const results = [];
    const notifiedTasks = new Set(); // Track tasks we've already notified about

    for (const task of tasks) {
      // Skip if we've already notified about this task
      if (notifiedTasks.has(task._id.toString())) {
        continue;
      }

      // Check if task is within 24 hours
      const dueDate = new Date(task.dueDate);
      const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Only notify if task is due within 24 hours
      if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
        const boardId = task.board?._id?.toString() || task.board?.toString();

        if (boardId) {
          try {
            // Filter assignees who want deadline notifications
            const assigneesToNotify = task.assignees.filter((assignee) => {
              const prefs = assignee.notificationPreferences || {};
              return (
                assignee.emailNotifications !== false &&
                prefs.taskDeadline !== false &&
                assignee.email
              );
            });

            if (assigneesToNotify.length > 0) {
              // Notify each assignee
              const notificationPromises = assigneesToNotify.map((assignee) =>
                notifyDeadlineApproaching(task, boardId)
              );

              await Promise.all(notificationPromises);

              notifiedTasks.add(task._id.toString());
              results.push({
                taskId: task._id.toString(),
                taskTitle: task.title,
                dueDate: task.dueDate,
                assigneesNotified: assigneesToNotify.length,
                success: true,
              });
            }
          } catch (error) {
            console.error(
              `[Deadline Reminder] Error notifying for task ${task._id}:`,
              error
            );
            results.push({
              taskId: task._id.toString(),
              taskTitle: task.title,
              success: false,
              error: error.message,
            });
          }
        }
      }
    }

    // Also check for tasks due today (within next 6 hours)
    const in6Hours = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const tasksDueToday = await Task.find({
      dueDate: {
        $gte: now,
        $lte: in6Hours,
      },
      completed: false,
      assignees: { $exists: true, $ne: [] },
      _id: { $nin: Array.from(notifiedTasks).map((id) => id) }, // Exclude already notified
    })
      .populate("board", "_id title")
      .populate("assignees", "_id email emailNotifications notificationPreferences");

    for (const task of tasksDueToday) {
      const boardId = task.board?._id?.toString() || task.board?.toString();

      if (boardId) {
        try {
          const assigneesToNotify = task.assignees.filter((assignee) => {
            const prefs = assignee.notificationPreferences || {};
            return (
              assignee.emailNotifications !== false &&
              prefs.taskDeadline !== false &&
              assignee.email
            );
          });

          if (assigneesToNotify.length > 0) {
            await notifyDeadlineApproaching(task, boardId);
            results.push({
              taskId: task._id.toString(),
              taskTitle: task.title,
              dueDate: task.dueDate,
              assigneesNotified: assigneesToNotify.length,
              success: true,
            });
          }
        } catch (error) {
          console.error(
            `[Deadline Reminder] Error notifying for task ${task._id}:`,
            error
          );
          results.push({
            taskId: task._id.toString(),
            taskTitle: task.title,
            success: false,
            error: error.message,
          });
        }
      }
    }

    return NextResponse.json(
      {
        message: "Deadline reminders processed",
        tasksChecked: tasks.length + tasksDueToday.length,
        notificationsSent: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
        results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Deadline Reminder] Error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint for manual testing
export async function GET(request) {
  return POST(request);
}

