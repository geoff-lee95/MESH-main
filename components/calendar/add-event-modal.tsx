"use client"

import { useState } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createEvent, type EventType } from "@/app/actions/event-actions"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

const eventTypes: EventType[] = ["Deployment", "Deadline", "Maintenance", "Review", "Meeting", "Other"]

const formSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(100, {
      message: "Title must not exceed 100 characters.",
    }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  type: z.enum(["Deployment", "Deadline", "Maintenance", "Review", "Meeting", "Other"], {
    required_error: "Please select an event type.",
  }),
  description: z
    .string()
    .max(500, {
      message: "Description must not exceed 500 characters.",
    })
    .optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      time: "12:00",
      type: "Meeting",
      description: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Format the date to YYYY-MM-DD
      const formattedDate = format(data.date, "yyyy-MM-dd")

      // Create FormData object
      const formData = new FormData()
      formData.append("title", data.title)
      formData.append("date", formattedDate)
      formData.append("time", data.time)
      formData.append("type", data.type)
      formData.append("description", data.description || "")

      const result = await createEvent(formData)

      if (result.success) {
        toast({
          title: "Event created",
          description: "Your event has been created successfully.",
        })
        form.reset()
        onClose()
        // Force a page refresh to show the new event
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="font-light">Add New Event</DialogTitle>
          <DialogDescription className="text-xs">Create a new event for your calendar.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Event title" {...field} className="h-8" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel className="text-xs">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className="w-full h-8 pl-3 text-left text-xs font-light">
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs">Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Input type="time" {...field} className="w-full h-8" />
                        <Clock className="ml-2 h-3 w-3 opacity-50" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Event Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type} className="text-xs">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Event description (optional)" className="resize-none h-20" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Provide additional details about this event.</FormDescription>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={onClose} size="sm">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} size="sm">
                {isSubmitting ? "Creating..." : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
