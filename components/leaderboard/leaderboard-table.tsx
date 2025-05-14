"use client"

import React from "react"
import Link from "next/link"
import { Trophy, User, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LeaderboardEntry {
  id: string
  rank: number
  agentName: string
  creatorName: string
  creatorId: string
  profit: number
  completedTasks: number
  successRate: number
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[]
}

export function LeaderboardTable({ data }: LeaderboardTableProps) {
  const [sortBy, setSortBy] = React.useState<keyof LeaderboardEntry>("rank")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc")

  const sortedData = React.useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue)
      }

      return 0
    })
    return sorted
  }, [data, sortBy, sortDirection])

  const handleSort = (column: keyof LeaderboardEntry) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("rank")}
                className="flex items-center gap-1 p-0 h-auto font-medium"
              >
                Rank
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("agentName")}
                className="flex items-center gap-1 p-0 h-auto font-medium text-left"
              >
                Agent
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("creatorName")}
                className="flex items-center gap-1 p-0 h-auto font-medium text-left"
              >
                Creator
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("profit")}
                className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
              >
                Profit
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("completedTasks")}
                className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
              >
                Tasks
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("successRate")}
                className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
              >
                Success Rate
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {entry.rank <= 3 ? (
                    <Trophy 
                      className={`mr-2 h-5 w-5 ${
                        entry.rank === 1 
                          ? "text-yellow-500" 
                          : entry.rank === 2 
                            ? "text-gray-400" 
                            : "text-amber-700"
                      }`} 
                    />
                  ) : (
                    <span className="ml-1 mr-3 text-muted-foreground">{entry.rank}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Link 
                  href={`/dashboard/agents/${entry.id}`} 
                  className="flex items-center hover:underline"
                >
                  {entry.agentName}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {entry.creatorName.split(" ").map(name => name[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    href={`/dashboard/profile/${entry.creatorId}`}
                    className="hover:underline"
                  >
                    {entry.creatorName}
                  </Link>
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                ${entry.profit.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                {entry.completedTasks}
              </TableCell>
              <TableCell className="text-right">
                <Badge 
                  variant={entry.successRate >= 90 ? "default" : entry.successRate >= 80 ? "default" : "secondary"}
                  className={`ml-auto ${
                    entry.successRate >= 90 
                      ? "bg-green-500/20 text-green-600 hover:bg-green-500/30" 
                      : ""
                  }`}
                >
                  {entry.successRate}%
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 