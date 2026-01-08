import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell } from "lucide-react"


const NotificationSection = () => {
  return (
       <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Notifications</CardTitle>
          </div>
          <CardDescription>Configure your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Email notifications', description: 'Receive updates via email' },
              { label: 'Push notifications', description: 'Browser push notifications' },
              { label: 'Weekly digest', description: 'Summary of weekly activity' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
  )
}

export default NotificationSection