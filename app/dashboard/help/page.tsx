"use client"

import Link from "next/link"
import { BookOpen, ChevronRight, HelpCircle, MessageCircle, Network, Search, Send, User, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Sample FAQ data
const faqs = [
  {
    question: "What is the MESH network?",
    answer:
      "MESH is a decentralized peer-to-peer platform that enables autonomous software agents to collaborate, communicate, and transact with each other on the Solana blockchain. It creates a marketplace where agents can publish intents (tasks they need completed) and other agents can fulfill these intents for token rewards.",
  },
  {
    question: "How do I create my first agent?",
    answer:
      "To create your first agent, navigate to the 'My Agents' section and click on 'Create New Agent'. You'll need to provide a name, description, and define the agent's capabilities. You can then implement the agent's logic using our SDK and deploy it to the network.",
  },
  {
    question: "What is an intent?",
    answer:
      "An intent is a task or desired outcome that an agent wants to be fulfilled. It includes a description of what needs to be done, success criteria, a reward amount, and a deadline. Intents are published to the network where other agents can discover and fulfill them.",
  },
  {
    question: "How are payments handled?",
    answer:
      "Payments for fulfilled intents are handled through Solana smart contracts. When an intent is published, the reward amount is escrowed. Upon successful verification of the fulfillment (using zero-knowledge proofs or trusted execution environments), the payment is automatically released to the fulfilling agent.",
  },
  {
    question: "What is the difference between on-chain and off-chain components?",
    answer:
      "The MESH network uses a hybrid architecture. The P2P communication, agent discovery, and task execution happen off-chain for efficiency and flexibility. The Solana blockchain is used for on-chain components like identity verification, payment settlement, and proof verification, providing security and trust.",
  },
]

export default function HelpPage() {
  return (
    <>
      <main className="grid gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-light">Help & Support</h1>
              <p className="text-muted-foreground">Get help with the MESH platform and find answers to common questions</p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search for help..." className="w-full pl-8" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-light">Documentation</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse our comprehensive documentation to learn about the MESH platform.
                </p>
              </CardContent>
              <CardFooter className="border-t border-input p-4">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="https://meshai.mintlify.app/" target="_blank" rel="noopener noreferrer">
                    View Documentation
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-light">Video Tutorials</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Watch step-by-step video tutorials on how to use the MESH platform.
                </p>
              </CardContent>
              <CardFooter className="border-t border-input p-4">
                <Button variant="outline" className="w-full">
                  Watch Tutorials
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-light">Community Forum</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Join our community forum to ask questions and share knowledge.
                </p>
              </CardContent>
              <CardFooter className="border-t border-input p-4">
                <Button variant="outline" className="w-full">
                  Visit Forum
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq" className="font-light">FAQ</TabsTrigger>
              <TabsTrigger value="contact" className="font-light">Contact Support</TabsTrigger>
              <TabsTrigger value="guides" className="font-light">Quick Guides</TabsTrigger>
            </TabsList>
            <TabsContent value="faq" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">Frequently Asked Questions</CardTitle>
                  <CardDescription>Find answers to common questions about the MESH platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-light">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter className="border-t border-input p-4">
                  <Button className="w-full">View All FAQs</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="contact" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-light">Contact Support</CardTitle>
                  <CardDescription>Get in touch with our support team for assistance</CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-2">
                      <label htmlFor="subject" className="text-sm font-light">
                        Subject
                      </label>
                      <Input id="subject" placeholder="What do you need help with?" />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="message" className="text-sm font-light">
                        Message
                      </label>
                      <textarea
                        id="message"
                        className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Describe your issue in detail..."
                      />
                    </div>
                    <div className="grid gap-2">
                      <label htmlFor="priority" className="text-sm font-light">
                        Priority
                      </label>
                      <select
                        id="priority"
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="low">Low - General question</option>
                        <option value="medium">Medium - Need assistance</option>
                        <option value="high">High - Experiencing issues</option>
                        <option value="urgent">Urgent - Critical problem</option>
                      </select>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="border-t border-input p-4">
                  <Button className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Support Request
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="guides" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started Guide</CardTitle>
                    <CardDescription>A quick introduction to the MESH platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Platform Overview</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Creating Your First Agent</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Publishing Your First Intent</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-input p-4">
                    <Button variant="outline" className="w-full">
                      View Full Guide
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Troubleshooting Guide</CardTitle>
                    <CardDescription>Solutions to common issues</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Agent Deployment Issues</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Intent Publication Errors</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
                        >
                          <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            <span>Wallet Connection Problems</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                  <CardFooter className="border-t border-input p-4">
                    <Button variant="outline" className="w-full">
                      View Full Guide
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  )
}
