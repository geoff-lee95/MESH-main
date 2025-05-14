"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUserNotifications() {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Get the user's notifications
    const { data: notifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      console.error("Error fetching notifications:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: notifications || [],
    }
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return {
      success: false,
      error: "Failed to fetch notifications",
    }
  }
}

export async function markNotificationAsRead(id: string) {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Update the notification
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id).eq("user_id", user.id)

    if (error) {
      console.error("Error marking notification as read:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate paths that might display notifications
    revalidatePath("/dashboard")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return {
      success: false,
      error: "Failed to mark notification as read",
    }
  }
}

export async function markAllNotificationsAsRead() {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        error: "User not authenticated",
      }
    }

    // Update all notifications
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    if (error) {
      console.error("Error marking all notifications as read:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate paths that might display notifications
    revalidatePath("/dashboard")

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return {
      success: false,
      error: "Failed to mark all notifications as read",
    }
  }
}
