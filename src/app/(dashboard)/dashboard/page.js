import { LayoutDashboard, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const stats = [
    {
      title: "Total Boards",
      value: "12",
      change: "+2 this week",
      icon: LayoutDashboard,
      color: "text-blue-500",
    },
    {
      title: "Active Tasks",
      value: "48",
      change: "+12% from last week",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "Team Members",
      value: "8",
      change: "+1 new member",
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Completion Rate",
      value: "87%",
      change: "+5% from last week",
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ];

  const recentBoards = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Redesigning company website",
      color: "gradient-blue",
      tasks: 15,
      members: 5,
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Building iOS and Android apps",
      color: "gradient-green",
      tasks: 23,
      members: 4,
    },
    {
      id: 3,
      name: "Marketing Campaign Q1",
      description: "Q1 2024 marketing initiatives",
      color: "gradient-purple",
      tasks: 18,
      members: 6,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "completed task",
      task: "Design homepage mockup",
      time: "2 hours ago",
      avatar: null,
    },
    {
      id: 2,
      user: "Mike Chen",
      action: "added comment to",
      task: "API Integration",
      time: "4 hours ago",
      avatar: null,
    },
    {
      id: 3,
      user: "Emily Davis",
      action: "created new board",
      task: "Product Launch",
      time: "5 hours ago",
      avatar: null,
    },
    {
      id: 4,
      user: "Alex Rodriguez",
      action: "moved task",
      task: "User Testing",
      time: "Yesterday",
      avatar: null,
    },
  ];

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Complete UI Design",
      board: "Website Redesign",
      dueDate: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      title: "API Documentation",
      board: "Mobile App",
      dueDate: "2024-01-18",
      priority: "medium",
    },
    {
      id: 3,
      title: "Marketing Assets",
      board: "Marketing Campaign",
      dueDate: "2024-01-20",
      priority: "urgent",
    },
  ];

  const priorityColors = {
    low: "default",
    medium: "warning",
    high: "info",
    urgent: "destructive",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Boards */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Boards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentBoards.map((board) => (
              <div
                key={board.id}
                className="flex items-center gap-4 p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className={`h-16 w-16 rounded-lg ${board.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{board.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {board.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{board.tasks} tasks</span>
                    <span>•</span>
                    <span>{board.members} members</span>
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Boards
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar name={activity.user} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-muted-foreground">
                      {activity.action}
                    </span>{" "}
                    <span className="font-medium">{activity.task}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{task.title}</h4>
                      <Badge variant={priorityColors[task.priority]} className="capitalize">
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.board} • Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Button size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}