"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Network, Plus, User, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddEventModal } from "@/components/calendar/add-event-modal"
import { getEvents, deleteEvent, type CalendarEvent, type EventType } from "@/app/actions/event-actions"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Generate days for the calendar
const generateCalendarDays = (year: number, month: number, events: CalendarEvent[]) => {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push({ day: null, events: [] })
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayEvents = events.filter((event) => event.date === date)
    days.push({ day, date, events: dayEvents })
  }

  return days
}

// Get badge color based on event type
const getEventBadgeVariant = (type: EventType) => {
  const variants: Record<EventType, "default" | "secondary" | "destructive" | "outline"> = {
    Deployment: "default",
    Deadline: "destructive",
    Maintenance: "secondary",
    Review: "outline",
    Meeting: "default",
    Other: "outline",
  }
  return variants[type] || "default"
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [eventToDelete, setEventToDelete] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  useEffect(() => {
    async function loadEvents() {
      setIsLoading(true)
      try {
        const result = await getEvents()
        if (result.success) {
          setEvents(result.data)
        } else {
          console.error("Failed to load events:", result.error)
          toast({
            title: "Error",
            description: "Failed to load events",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const calendarDays = generateCalendarDays(year, month, events)

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const result = await deleteEvent(id)
      if (result.success) {
        setEvents(events.filter((event) => event.id !== id))
        toast({
          title: "Event deleted",
          description: "The event has been deleted successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete event",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting event:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setEventToDelete(null)
    }
  }

  // Get upcoming events (sorted by date)
  const upcomingEvents = [...events]
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
    .filter((event) => {
      const eventDate = new Date(`${event.date}T${event.time}`)
      return eventDate >= new Date()
    })
    .slice(0, 4) // Show only the next 4 upcoming events

  return (
    <>
      <main className="grid gap-3 p-3 md:gap-4 md:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-xl font-light">Calendar</h1>
              <p className="text-muted-foreground font-light text-sm">Schedule and track agent activities and deadlines</p>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="text-sm font-light mx-1">
                {monthNames[month]} {year}
              </div>
              <Select defaultValue="month">
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="View" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" onClick={() => setIsAddEventModalOpen(true)}>
                <Plus className="mr-1 h-3 w-3" /> Add Event
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading calendar...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-7 border-b border-input">
                    {weekDays.map((day) => (
                      <div key={day} className="p-1 text-center text-xs font-light">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 auto-rows-fr">
                    {calendarDays.map((day, index) => (
                      <div
                        key={index}
                        className={`min-h-[80px] border-b border-r border-input p-1 ${day.day ? "" : "bg-muted/20"} ${
                          day.day === new Date().getDate() &&
                          month === new Date().getMonth() &&
                          year === new Date().getFullYear()
                            ? "bg-primary/5"
                            : ""
                        }`}
                      >
                        {day.day && (
                          <>
                            <div className="flex justify-between">
                              <div
                                className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                                  day.day === new Date().getDate() &&
                                  month === new Date().getMonth() &&
                                  year === new Date().getFullYear()
                                    ? "bg-primary text-primary-foreground"
                                    : ""
                                }`}
                              >
                                {day.day}
                              </div>
                              {day.events.length > 0 && (
                                <div className="text-[10px] text-muted-foreground">
                                  {day.events.length} event{day.events.length > 1 ? "s" : ""}
                                </div>
                              )}
                            </div>
                            <div className="mt-1 space-y-1">
                              {day.events.slice(0, 2).map((event) => (
                                <div
                                  key={event.id}
                                  className="flex items-center rounded-sm bg-primary/10 px-1 py-0.5 text-[10px]"
                                >
                                  <div className="mr-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                                  <div className="truncate">{event.title}</div>
                                </div>
                              ))}
                              {day.events.length > 2 && (
                                <div className="text-[10px] text-muted-foreground px-1">
                                  +{day.events.length - 2} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-lg font-light mb-3">Upcoming Events</h2>
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm">Loading events...</p>
                </div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="overflow-hidden">
                    <CardHeader className="p-3 pb-1">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-sm">{event.title}</CardTitle>
                        <Badge variant={getEventBadgeVariant(event.type)} className="text-[10px] h-5">
                          {event.type}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {new Date(event.date).toLocaleDateString()}
                          <Clock className="ml-2 mr-1 h-3 w-3" />
                          {event.time}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-1">
                      <p className="text-xs line-clamp-2">{event.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 border-t border-input p-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive h-7 text-xs">
                            <Trash2 className="h-3 w-3 mr-1" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this event? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEvent(event.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button size="sm" className="h-7 text-xs">
                        View
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-4">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground font-light text-sm mb-2">
                    No upcoming events found. Click the "Add Event" button to create your first event.
                  </p>
                  <Button onClick={() => setIsAddEventModalOpen(true)} size="sm">
                    <Plus className="mr-1 h-3 w-3" /> Add Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} />
    </>
  )
}
