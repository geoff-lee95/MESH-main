"use client"

import { useParams } from "next/navigation"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the actual content components
import IntroductionPage from "../../getting-started/intro"
import ConceptsPage from "../../getting-started/concepts"
import QuickStartPage from "../../getting-started/quickstart" 
import CreateAgentPage from "../../agents/create-agent"
import AgentSDKPage from "../../agents/agent-sdk"
import AgentLifecyclePage from "../../agents/agent-lifecycle"
import IntentSpecPage from "../../intents/intent-spec"
import P2POverviewPage from "../../p2p/p2p-overview"
import SolanaBasicsPage from "../../solana/solana-basics"

// Define the article map type
type ArticleMap = {
  [category: string]: {
    [article: string]: React.ComponentType;
  };
};

// This is a dynamic route for documentation articles
export default function DocumentationArticlePage() {
  const params = useParams()
  const { category, article } = params as { category: string; article: string }

  // Map of category/article paths to their component files
  const articleMap: ArticleMap = {
    "getting-started": {
      "intro": IntroductionPage,
      "concepts": ConceptsPage,
      "quickstart": QuickStartPage,
    },
    "agents": {
      "create-agent": CreateAgentPage,
      "agent-sdk": AgentSDKPage,
      "agent-lifecycle": AgentLifecyclePage,
    },
    "intents": {
      "intent-spec": IntentSpecPage,
      "publish-intent": IntroductionPage, // Temporary fallback 
      "fulfill-intent": IntroductionPage, // Temporary fallback
    },
    "p2p": {
      "p2p-overview": P2POverviewPage,
      "libp2p": IntroductionPage, // Temporary fallback
      "messaging": IntroductionPage, // Temporary fallback
    },
    "solana": {
      "solana-basics": SolanaBasicsPage,
      "smart-contracts": IntroductionPage, // Temporary fallback
      "verification": IntroductionPage, // Temporary fallback
    },
  }

  // Check if this is a valid category and article
  if (!category || !article || !articleMap[category] || !articleMap[category][article]) {
    return notFound()
  }

  // Render the appropriate component
  const ContentComponent = articleMap[category][article]
  return <ContentComponent />
} 