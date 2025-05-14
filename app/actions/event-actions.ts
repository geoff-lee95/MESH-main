"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type EventType = "Deployment" | "Deadline" | "Maintenance" | "Review" | "Meeting" | "Other"

export interface CalendarEvent {
  id: string
  title: string
  date: string
  time: string
  type: EventType
  description: string
  user_id: string
  created_at?: string
}

export async function createEvent(formData: FormData) {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const userId = session.user.id
    const title = formData.get("title") as string
    const date = formData.get("date") as string
    const time = formData.get("time") as string
    const type = formData.get("type") as EventType
    const description = formData.get("description") as string

    // Validate inputs
    if (!title || !date || !time || !type) {
      return { success: false, error: "Missing required fields" }
    }

    // Generate a unique ID
    const id = `EVT-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`

    // Insert the event into the database
    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        id,
        title,
        date,
        time,
        type,
        description,
        user_id: userId,
      })
      .select()

    if (error) {
      console.error("Error creating event:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the calendar page to show the new event
    revalidatePath("/dashboard/calendar")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating event:", error)
    return { success: false, error: "Failed to create event" }
  }
}

export async function getEvents() {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated", data: [] }
    }

    const userId = session.user.id

    // Check if the table exists first
    const { error: tableCheckError } = await supabase.from("calendar_events").select("id").limit(1).maybeSingle()

    // If there's a "relation does not exist" error, return an empty array
    if (
      tableCheckError &&
      tableCheckError.message.includes("relation") &&
      tableCheckError.message.includes("does not exist")
    ) {
      console.warn("Calendar events table does not exist yet. Returning empty array.")
      return { success: true, data: [] }
    }

    // Get all events for the current user
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true })

    if (error) {
      console.error("Error fetching events:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data as CalendarEvent[] }
  } catch (error) {
    console.error("Error fetching events:", error)
    return { success: false, error: "Failed to fetch events", data: [] }
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const supabase = await createServerClient()

    // Get the current user
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    // Delete the event
    const { error } = await supabase.from("calendar_events").delete().eq("id", eventId).eq("user_id", session.user.id)

    if (error) {
      console.error("Error deleting event:", error)
      return { success: false, error: error.message }
    }

    // Revalidate the calendar page to update the UI
    revalidatePath("/dashboard/calendar")

    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { success: false, error: "Failed to delete event" }
  }
}
