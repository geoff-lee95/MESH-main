"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { getUserNotifications, markNotificationAsRead } from "@/app/actions/notification-actions"

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open])

  async function loadNotifications() {
    try {
      setIsLoading(true)
      const result = await getUserNotifications()

      if (result.success) {
        setNotifications(result.data)
        setUnreadCount(result.data.filter((n: any) => !n.read).length)
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      const result = await markNotificationAsRead(id)

      if (result.success) {
        // Update local state
        setNotifications(
          notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification,
          ),
        )
        setUnreadCount(Math.max(0, unreadCount - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">No notifications</div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-default">
                <div className="flex w-full justify-between">
                  <span className={`font-medium ${!notification.read ? "text-primary" : ""}`}>
                    {notification.title}
                  </span>
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
                <span className="text-xs text-muted-foreground mt-1">{formatDate(notification.created_at)}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center" asChild>
          <Button variant="ghost" className="w-full" size="sm">
            View All Notifications
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
