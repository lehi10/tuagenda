"use client"

import { Bell, Calendar, DollarSign, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/i18n"

interface Notification {
  id: string
  type: "appointment" | "payment" | "client" | "general"
  title: string
  message: string
  time: string
  read: boolean
}

export function NotificationList() {
  const { t } = useTranslation()

  const notifications: Notification[] = [
    {
      id: "1",
      type: "appointment",
      title: "New Appointment",
      message: "John Doe booked a haircut for tomorrow at 10:00 AM",
      time: "5 min ago",
      read: false,
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      message: "Payment of $60.00 received from Jane Smith",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "client",
      title: "New Client",
      message: "Bob Wilson registered as a new client",
      time: "2 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "general",
      title: "System Update",
      message: "New features are available in the dashboard",
      time: "1 day ago",
      read: true,
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5" />
      case "payment":
        return <DollarSign className="h-5 w-5" />
      case "client":
        return <UserPlus className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.read)
  const allNotifications = notifications

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={notification.read ? "opacity-60" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              {!notification.read && (
                <Badge variant="default" className="ml-2">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {notification.message}
            </p>
            <span className="text-xs text-muted-foreground">
              {notification.time}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {unreadNotifications.length} unread notifications
        </h3>
        <Button variant="outline" size="sm">
          {t.pages.notifications.markAllAsRead}
        </Button>
      </div>

      <Tabs defaultValue="unread">
        <TabsList className="mb-4">
          <TabsTrigger value="unread">
            Unread ({unreadNotifications.length})
          </TabsTrigger>
          <TabsTrigger value="all">All ({allNotifications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3">
          {unreadNotifications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {t.pages.notifications.noNotifications}
            </p>
          ) : (
            unreadNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {allNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
