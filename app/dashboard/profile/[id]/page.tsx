import { redirect } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Code2, Star, Trophy, User } from "lucide-react"

interface Agent {
  id: string;
  name: string;
  description: string;
  profit: number;
  tasks: number;
  successRate: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  bio: string;
  website: string;
  github: string;
  twitter: string;
  skills: string[];
  avatarUrl: string;
  agents: Agent[];
}

// Mock user data for placeholder
const mockUsers: Record<string, UserProfile> = {
  "user123": {
    id: "user123",
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    joinedAt: "2023-01-15",
    bio: "Senior AI Engineer with expertise in NLP and machine learning. Building intelligent agents that solve real-world problems.",
    website: "https://sarahchen.dev",
    github: "sarahchen",
    twitter: "sarahchenai",
    skills: ["Machine Learning", "NLP", "Python", "TensorFlow", "PyTorch"],
    avatarUrl: "",
    agents: [
      {
        id: "1",
        name: "MarketMaster",
        description: "Advanced trading agent with real-time market analysis and automated execution capabilities.",
        profit: 1250.75,
        tasks: 45,
        successRate: 98,
      },
      {
        id: "11",
        name: "DataProcessor",
        description: "Specialized in ETL operations and data pipeline management across multiple sources.",
        profit: 350.25,
        tasks: 28,
        successRate: 92,
      }
    ]
  },
  "user456": {
    id: "user456",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joinedAt: "2023-02-20",
    bio: "Full-stack developer and AI enthusiast. Creating intelligent automation solutions for businesses.",
    website: "https://alexjohnson.tech",
    github: "alexjtech",
    twitter: "alexjohnsondev",
    skills: ["JavaScript", "TypeScript", "React", "Node.js", "AI Integration"],
    avatarUrl: "",
    agents: [
      {
        id: "2",
        name: "DataHarvester",
        description: "Advanced web scraping and data collection agent with built-in analytics.",
        profit: 980.50,
        tasks: 38,
        successRate: 95,
      }
    ]
  },
  "user789": {
    id: "user789",
    name: "Miguel Rodriguez",
    email: "miguel.r@example.com",
    joinedAt: "2023-03-10",
    bio: "Software architect with focus on AI systems and distributed computing. Building scalable agent networks.",
    website: "https://mrodriguez.io",
    github: "mrodriguezdev",
    twitter: "miguelrdev",
    skills: ["System Architecture", "Distributed Systems", "Golang", "Rust", "AI"],
    avatarUrl: "",
    agents: [
      {
        id: "3",
        name: "CodeGenius",
        description: "Automated code review and optimization agent with language-agnostic capabilities.",
        profit: 875.25,
        tasks: 32,
        successRate: 92,
      }
    ]
  },
  "user101": {
    id: "user101",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    joinedAt: "2023-04-05",
    bio: "Financial analyst and algorithmic trading specialist. Creating AI-powered solutions for investment strategies.",
    website: "https://priyapatel.finance",
    github: "priyafintech",
    twitter: "priyafintech",
    skills: ["Financial Modeling", "Algorithmic Trading", "Python", "R", "Data Analysis"],
    avatarUrl: "",
    agents: [
      {
        id: "4",
        name: "FinanceBot",
        description: "Intelligent financial analysis and portfolio management agent with market prediction capabilities.",
        profit: 750.80,
        tasks: 28,
        successRate: 90,
      }
    ]
  },
  "user102": {
    id: "user102",
    name: "Jordan Taylor",
    email: "jordan.t@example.com",
    joinedAt: "2023-05-12",
    bio: "Content strategist and digital marketing expert. Using AI to streamline content production and analysis.",
    website: "https://jordantaylor.media",
    github: "jordantmedia",
    twitter: "jordantaylormedia",
    skills: ["Content Strategy", "SEO", "Digital Marketing", "AI Writing", "Analytics"],
    avatarUrl: "",
    agents: [
      {
        id: "5",
        name: "ContentCurator",
        description: "Advanced content management system with SEO optimization and audience targeting.",
        profit: 680.40,
        tasks: 26,
        successRate: 88,
      }
    ]
  },
  "user103": {
    id: "user103",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    joinedAt: "2023-06-20",
    bio: "Academic researcher specializing in data science and knowledge management systems.",
    website: "https://emmawilson.academic",
    github: "emmawresearch",
    twitter: "emmaresearcher",
    skills: ["Research Methods", "Data Science", "Knowledge Management", "Python", "Natural Language Processing"],
    avatarUrl: "",
    agents: [
      {
        id: "6",
        name: "ResearchAssistant",
        description: "Intelligent research agent that analyzes academic papers and generates literature reviews.",
        profit: 595.60,
        tasks: 22,
        successRate: 85,
      }
    ]
  },
  "user104": {
    id: "user104",
    name: "David Park",
    email: "david.park@example.com",
    joinedAt: "2023-07-08",
    bio: "Customer experience specialist and support automation expert. Building AI-powered support solutions.",
    website: "https://davidpark.support",
    github: "davidsupport",
    twitter: "davidparkcx",
    skills: ["Customer Support", "UX Design", "Automation", "Javascript", "Chatbot Development"],
    avatarUrl: "",
    agents: [
      {
        id: "7",
        name: "CustomerService",
        description: "Advanced customer support agent with natural language understanding and issue resolution.",
        profit: 520.30,
        tasks: 20,
        successRate: 82,
      }
    ]
  },
  "user105": {
    id: "user105",
    name: "Sofia Garcia",
    email: "sofia.g@example.com",
    joinedAt: "2023-08-15",
    bio: "Data analytics professional specializing in business intelligence and predictive modeling.",
    website: "https://sofiagarcia.analytics",
    github: "sofiaanalytics",
    twitter: "sofiaanalyticsai",
    skills: ["Data Analytics", "Business Intelligence", "SQL", "Python", "Predictive Modeling"],
    avatarUrl: "",
    agents: [
      {
        id: "8",
        name: "AnalyticsExpert",
        description: "Business analytics agent that processes data and generates actionable insights and visualizations.",
        profit: 480.90,
        tasks: 18,
        successRate: 80,
      }
    ]
  },
  "user106": {
    id: "user106",
    name: "Hiroshi Tanaka",
    email: "hiroshi.t@example.com",
    joinedAt: "2023-09-03",
    bio: "Multilingual language specialist and translation technology expert. Creating cross-cultural AI solutions.",
    website: "https://hiroshitanaka.lang",
    github: "hiroshilang",
    twitter: "hiroshitrans",
    skills: ["Translation", "Multilingual NLP", "Cultural Adaptation", "Python", "Linguistics"],
    avatarUrl: "",
    agents: [
      {
        id: "9",
        name: "TranslatorPro",
        description: "Advanced translation agent with cultural context understanding and content adaptation capabilities.",
        profit: 420.15,
        tasks: 16,
        successRate: 78,
      }
    ]
  },
  "user107": {
    id: "user107",
    name: "Olivia Brown",
    email: "olivia.b@example.com",
    joinedAt: "2023-10-07",
    bio: "Productivity consultant and workflow optimization specialist. Building AI systems for time management.",
    website: "https://oliviabrown.optimize",
    github: "oliviaoptimize",
    twitter: "oliviabproductive",
    skills: ["Productivity Systems", "Time Management", "Workflow Design", "Javascript", "Project Management"],
    avatarUrl: "",
    agents: [
      {
        id: "10",
        name: "ScheduleOptimizer",
        description: "Intelligent scheduling agent that optimizes calendars and manages tasks based on priorities.",
        profit: 380.60,
        tasks: 14,
        successRate: 75,
      }
    ]
  }
};

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const userId = params.id;
  const supabase = await createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/sign-in")
  }

  // In a real implementation, we would fetch the user profile from the database
  // For now, use mock data or return a not found page
  const profileData = mockUsers[userId];

  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center p-6 gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-light mb-2">User Not Found</h1>
          <p className="text-muted-foreground">The user profile you're looking for doesn't exist.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/leaderboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaderboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/leaderboard">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-light">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {profileData.avatarUrl ? (
                  <AvatarImage src={profileData.avatarUrl} alt={profileData.name} />
                ) : null}
                <AvatarFallback className="text-2xl">
                  {profileData.name.split(" ").map((name: string) => name[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="font-light text-2xl">{profileData.name}</CardTitle>
              <p className="text-muted-foreground">{profileData.email}</p>
              <div className="flex items-center gap-1 mt-2">
                <Badge variant="outline" className="rounded-sm">
                  <Trophy className="mr-1 h-3 w-3" /> Top Creator
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">About</h3>
                <p className="text-sm text-muted-foreground">{profileData.bio}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Joined</div>
                  <div>{new Date(profileData.joinedAt).toLocaleDateString()}</div>
                  
                  {profileData.website && (
                    <>
                      <div className="text-muted-foreground">Website</div>
                      <div>
                        <Link href={profileData.website} target="_blank" className="hover:underline">
                          {profileData.website.replace(/(^\w+:|^)\/\//, '')}
                        </Link>
                      </div>
                    </>
                  )}
                  
                  {profileData.github && (
                    <>
                      <div className="text-muted-foreground">GitHub</div>
                      <div>
                        <Link href={`https://github.com/${profileData.github}`} target="_blank" className="hover:underline">
                          {profileData.github}
                        </Link>
                      </div>
                    </>
                  )}
                  
                  {profileData.twitter && (
                    <>
                      <div className="text-muted-foreground">Twitter</div>
                      <div>
                        <Link href={`https://x.com/mesh_p2p`} target="_blank" className="hover:underline">
                          @mesh_p2p
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="rounded-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-light">Agent Portfolio</CardTitle>
            <CardDescription>Agents created by {profileData.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {profileData.agents.map((agent: Agent) => (
                <div key={agent.id} className="rounded-lg border p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                        <Code2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <Link href={`/dashboard/agents/${agent.id}`} className="text-lg font-medium hover:underline">
                          {agent.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 md:text-right">
                      <div className="flex items-center md:justify-end gap-2">
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                          ${agent.profit.toFixed(2)} profit
                        </Badge>
                        <Badge variant="outline">
                          {agent.successRate}% success
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {agent.tasks} tasks completed
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 