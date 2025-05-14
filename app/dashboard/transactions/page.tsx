"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Filter, Network, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"

// Mock transaction data generator
const generateMockTransactions = () => {
  const types = ["Intent Reward", "Agent Deployment", "Intent Publication", "Network Fee", "Deposit", "Withdrawal"]
  const statuses = ["Completed", "Pending", "Failed"]
  
  return Array.from({ length: 20 }, (_, i) => {
    const isIncome = Math.random() > 0.4
    const amount = isIncome 
      ? (Math.random() * 30 + 0.1).toFixed(2) 
      : (Math.random() * 2 + 0.01).toFixed(2)
    const type = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * (isIncome ? 2 : statuses.length))] // Income more likely to be completed
    
    // Create date within last 3 months
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 90))
    
    return {
      id: `tx-${i}-${Date.now()}`,
      type,
      amount: isIncome ? `+${amount}` : `-${amount}`,
      status,
      date: date.toISOString(),
      isIncome
    }
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date, newest first
}

export default function TransactionsPage() {
  const { user, profile } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 10
  
  // Fetch transactions on component mount
  useEffect(() => {
    // In a real app, this would fetch from an API
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        const data = generateMockTransactions()
        setTransactions(data)
        setFilteredTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])
  
  // Filter transactions when filter type or search term changes
  useEffect(() => {
    let filtered = [...transactions]
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(tx => {
        if (filterType === "income") return tx.isIncome
        if (filterType === "expense") return !tx.isIncome
        if (filterType === "pending") return tx.status === "Pending"
        return tx.type.toLowerCase().includes(filterType.toLowerCase())
      })
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(tx => 
        tx.type.toLowerCase().includes(term) || 
        tx.amount.includes(term) ||
        tx.status.toLowerCase().includes(term) ||
        new Date(tx.date).toLocaleDateString().includes(term)
      )
    }
    
    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page on filter change
  }, [filterType, searchTerm, transactions])
  
  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + transactionsPerPage
  )
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    })
  }
  
  return (
    <>
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-1.5 mb-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="sm" className="h-8 gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Settings
              </Button>
            </Link>
          </div>
          <h2 className="text-2xl font-light">Transaction History</h2>
          <p className="text-muted-foreground">
            View and filter your transaction history
          </p>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Select defaultValue="all" onValueChange={setFilterType}>
                  <SelectTrigger className="w-[160px]">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <span>Filter</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="Intent">Intent-related</SelectItem>
                    <SelectItem value="Agent">Agent-related</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" disabled={filteredTransactions.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-8 w-8 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
            ) : paginatedTransactions.length > 0 ? (
              <div className="space-y-1 rounded-md border">
                {paginatedTransactions.map((tx) => (
                  <div 
                    key={tx.id}
                    className="flex items-center justify-between p-3 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                        tx.isIncome ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {tx.isIncome ? '+' : '-'}
                      </div>
                      <div>
                        <div className="font-medium">{tx.type}</div>
                        <div className="text-sm text-muted-foreground">{formatDate(tx.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.amount} SOL
                      </div>
                      <div className="text-xs">
                        <Badge 
                          variant={
                            tx.status === "Completed" ? "outline" : 
                            tx.status === "Pending" ? "secondary" : 
                            "destructive"
                          }
                          className="font-normal"
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No transactions found matching your filters.
              </div>
            )}
          </CardContent>
          
          {!loading && filteredTransactions.length > transactionsPerPage && (
            <CardFooter className="flex items-center justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(startIndex + transactionsPerPage, filteredTransactions.length)}
                </span>{" "}
                of <span className="font-medium">{filteredTransactions.length}</span> transactions
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </main>
    </>
  )
} 