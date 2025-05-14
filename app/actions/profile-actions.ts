"use server"

import { revalidatePath } from "next/cache"
import { createServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export interface ProfileData {
  fullName: string
  profilePicture?: string
  role: string
  bio?: string
}

export async function updateProfile(data: ProfileData) {
  try {
    const cookieStore = cookies()
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

    // Update the profile in the database
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: data.fullName,
      avatar_url: data.profilePicture,
      role: data.role,
      bio: data.bio || null,
    })

    if (error) {
      console.error("Error updating profile:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    // Revalidate the dashboard page to show updated profile
    revalidatePath("/dashboard")

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      error: "Failed to update profile",
    }
  }
}

export async function getProfile(userId: string) {
  try {
    const supabase = await createServerClient()

    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching profile:", error)
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      data: {
        fullName: data.full_name || "",
        profilePicture: data.avatar_url || "",
        role: data.role || "",
        bio: data.bio || "",
      },
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return {
      success: false,
      error: "Failed to fetch profile",
    }
  }
}
