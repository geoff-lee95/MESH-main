"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Upload } from "lucide-react"
import type { Database } from "@/types/supabase"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface ProfileFormProps {
  profile: Partial<Profile> | null
}

export function ProfileForm({ profile: initialProfile }: ProfileFormProps) {
  const { user, profile: contextProfile, updateProfile, refreshProfile } = useAuth()
  const router = useRouter()
  
  // Use profile from context if available, otherwise use the prop
  const profile = contextProfile || initialProfile
  
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [role, setRole] = useState(profile?.role || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update form when profile changes in context
  useEffect(() => {
    if (contextProfile) {
      setFullName(contextProfile.full_name || "")
      setRole(contextProfile.role || "")
      setBio(contextProfile.bio || "")
      setAvatarUrl(contextProfile.avatar_url || "")
    }
  }, [contextProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: updateError, success: updateSuccess } = await updateProfile({
        full_name: fullName,
        role,
        bio,
        avatar_url: avatarUrl,
      })

      if (updateError) {
        setError(updateError)
      } else {
        setSuccess(true)
        // Refresh server-side data
        router.refresh()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)

    try {
      // Convert the file to a data URL
      const reader = new FileReader()
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string
        setAvatarUrl(dataUrl)
        
        try {
          // Update the profile with the new image
          const { error: updateError } = await updateProfile({
            avatar_url: dataUrl,
          })

          if (updateError) {
            setError(updateError)
          } else {
            // Refresh server-side data
            router.refresh()
          }
        } catch (error: any) {
          setError(error.message)
        } finally {
          setIsUploading(false)
        }
      }
      
      reader.readAsDataURL(file)
    } catch (error: any) {
      setError(error.message)
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert>
              <AlertDescription>Profile updated successfully!</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Developer, Researcher, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Profile Picture</Label>
            <div className="flex gap-2">
              <Input
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="flex-1"
              />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            {avatarUrl && (
              <div className="mt-2 flex justify-center">
                <img
                  src={avatarUrl || "/placeholder.svg"}
                  alt="Avatar preview"
                  className="h-24 w-24 rounded-full object-cover"
                  onError={() => setAvatarUrl("")}
                />
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isLoading || isUploading} className="ml-auto">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
