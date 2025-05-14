"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CheckCircle2, Upload, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  profilePicture: z.string().optional(),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  bio: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileCompletionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProfileUpdate: (progress: number, profile: ProfileFormValues) => void
  currentProgress: number
  initialProfile?: ProfileFormValues
}

export function ProfileCompletionModal({
  open,
  onOpenChange,
  onProfileUpdate,
  currentProgress,
  initialProfile,
}: ProfileCompletionModalProps) {
  const { updateProfile, profile: contextProfile } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null)
  const [activeStep, setActiveStep] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  // Merge initialProfile with context profile if available
  const mergedProfile = {
    fullName: initialProfile?.fullName || contextProfile?.full_name || "",
    profilePicture: initialProfile?.profilePicture || contextProfile?.avatar_url || "",
    role: initialProfile?.role || contextProfile?.role || "",
    bio: initialProfile?.bio || contextProfile?.bio || "",
  }

  const defaultValues: Partial<ProfileFormValues> = {
    fullName: mergedProfile.fullName,
    profilePicture: mergedProfile.profilePicture,
    role: mergedProfile.role,
    bio: mergedProfile.bio,
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  })

  // Update form values when initialProfile or contextProfile changes
  useEffect(() => {
    form.reset({
      fullName: mergedProfile.fullName,
      profilePicture: mergedProfile.profilePicture,
      role: mergedProfile.role,
      bio: mergedProfile.bio,
    })

    if (mergedProfile.profilePicture) {
      setUploadedImage(mergedProfile.profilePicture)
    }
  }, [initialProfile, contextProfile, form, mergedProfile])

  const steps = [
    { title: "Personal Information", description: "Add your basic information" },
    { title: "Profile Picture", description: "Upload a profile picture" },
    { title: "Agent Role", description: "Set your role in the MESH network" },
  ]

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const updatedProfile = {
        ...data,
        profilePicture: uploadedImage || "",
      }

      const { error, success } = await updateProfile({
        full_name: updatedProfile.fullName,
        avatar_url: updatedProfile.profilePicture,
        role: updatedProfile.role,
        bio: updatedProfile.bio
      })

      if (success) {
        setSubmitStatus({
          success: true,
          message: "Profile updated successfully!",
        })

        // Calculate new progress based on completed steps
        let newProgress = 0
        if (updatedProfile.fullName) newProgress += 33
        if (updatedProfile.profilePicture) newProgress += 33
        if (updatedProfile.role) newProgress += 34

        onProfileUpdate(newProgress, updatedProfile)
        
        // Refresh the page to reflect changes
        router.refresh()

        // Close the modal after a delay
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
      } else {
        setSubmitStatus({
          success: false,
          message: error || "Failed to update profile",
        })
      }
    } catch (error: any) {
      setSubmitStatus({
        success: false,
        message: error.message || "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const nextStep = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{steps[activeStep].title}</DialogTitle>
          <DialogDescription>{steps[activeStep].description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {activeStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormDescription>This is your public display name.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>This will be displayed on your profile.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
                    {uploadedImage ? (
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-16 w-16 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <label
                      htmlFor="picture-upload"
                      className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{uploadedImage ? "Change Picture" : "Upload Picture"}</span>
                      <input
                        id="picture-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-sm text-muted-foreground">Recommended: Square image, at least 300x300px</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Developer, Researcher, Trader" {...field} />
                    </FormControl>
                    <FormDescription>Your primary role in the MESH network.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {submitStatus && (
              <Alert variant={submitStatus.success ? "default" : "destructive"}>
                {submitStatus.success ? <CheckCircle2 className="h-4 w-4" /> : <div className="h-4 w-4" />}
                <AlertTitle>{submitStatus.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription>{submitStatus.message}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="flex flex-row items-center justify-between sm:justify-between">
              <div>
                {activeStep > 0 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Back
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                {activeStep < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Complete Profile"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
