"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  TooltipProps
} from "recharts"

// Sample data for line chart (Agent Performance)
const performanceData = [
  { name: "Jan", completion: 65, responseTime: 1.8 },
  { name: "Feb", completion: 70, responseTime: 1.6 },
  { name: "Mar", completion: 75, responseTime: 1.5 },
  { name: "Apr", completion: 68, responseTime: 1.7 },
  { name: "May", completion: 82, responseTime: 1.3 },
  { name: "Jun", completion: 87, responseTime: 1.2 },
]

// Sample data for bar chart (Agent Reputation)
const reputationData = [
  { name: "Agent A", score: 4.8 },
  { name: "Agent B", score: 4.5 },
  { name: "Agent C", score: 4.9 },
  { name: "Agent D", score: 4.2 },
  { name: "Agent E", score: 4.7 },
]

// Sample data for pie chart (Intent Distribution)
const intentTypeData = [
  { name: "Data Analysis", value: 42 },
  { name: "Content Creation", value: 28 },
  { name: "Research", value: 18 },
  { name: "Code Generation", value: 12 },
]

// Grey color palette with varying shades for better visual distinction
const GREYS = {
  primary: "#6B7280", // grey-500
  lighter: "#9CA3AF", // grey-400
  lightest: "#D1D5DB", // grey-300
  darker: "#4B5563", // grey-600
  darkest: "#374151", // grey-700
  background: "#F9FAFB", // grey-50
  grid: "#E5E7EB", // grey-200
}

// Sample data for area chart (Intent Fulfillment Timeline)
const fulfillmentData = [
  { name: "Week 1", simple: 2.1, medium: 4.5, complex: 8.2 },
  { name: "Week 2", simple: 1.9, medium: 4.2, complex: 7.8 },
  { name: "Week 3", simple: 2.3, medium: 3.8, complex: 8.5 },
  { name: "Week 4", simple: 1.8, medium: 4.0, complex: 7.5 },
  { name: "Week 5", simple: 1.6, medium: 3.5, complex: 6.8 },
  { name: "Week 6", simple: 1.5, medium: 3.2, complex: 6.5 },
]

// Sample data for network activity
const networkData = [
  { name: "Mon", connections: 800, messages: 1200 },
  { name: "Tue", connections: 940, messages: 1350 },
  { name: "Wed", connections: 1020, messages: 1500 },
  { name: "Thu", connections: 1180, messages: 1750 },
  { name: "Fri", connections: 1245, messages: 2100 },
  { name: "Sat", connections: 980, messages: 1400 },
  { name: "Sun", connections: 750, messages: 1100 },
]

// Custom tooltip component for all charts
const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (!active || !payload?.length) return null;
  
  return (
    <div className="bg-background border border-border rounded-md p-3 shadow-md text-sm">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className="flex items-center gap-2 text-muted-foreground">
          <div 
            className="h-2 w-2 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.name}: </span>
          <span className="font-medium text-foreground">{entry.value}</span>
          {entry.unit && <span>{entry.unit}</span>}
        </div>
      ))}
    </div>
  );
};

export function AgentPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={performanceData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.primary} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={GREYS.primary} stopOpacity={0.0}/>
          </linearGradient>
          <linearGradient id="responseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.darker} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={GREYS.darker} stopOpacity={0.0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GREYS.grid} />
        <XAxis 
          dataKey="name" 
          stroke={GREYS.primary} 
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <YAxis 
          yAxisId="left" 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
          domain={[0, 100]}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke={GREYS.darker}
          tick={{ fill: GREYS.darker }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
          domain={[0, 3]}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          wrapperStyle={{ paddingTop: 10 }}
          iconType="circle"
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="completion" 
          name="Completion Rate (%)" 
          stroke={GREYS.primary} 
          fill="url(#completionGradient)"
          strokeWidth={2.5}
          dot={{ stroke: GREYS.primary, strokeWidth: 2, r: 4, fill: "white" }}
          activeDot={{ r: 6, stroke: GREYS.primary, strokeWidth: 2, fill: "white" }} 
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="responseTime" 
          name="Response Time (s)" 
          stroke={GREYS.darker}
          fill="url(#responseGradient)"
          strokeWidth={2.5}
          strokeDasharray="5 5"
          dot={{ stroke: GREYS.darker, strokeWidth: 2, r: 4, fill: "white" }}
          activeDot={{ r: 6, stroke: GREYS.darker, strokeWidth: 2, fill: "white" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AgentReputationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={reputationData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={GREYS.primary} stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GREYS.grid} />
        <XAxis 
          dataKey="name" 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <YAxis 
          stroke={GREYS.primary} 
          domain={[0, 5]}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
          tickCount={6}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" />
        <Bar 
          dataKey="score" 
          name="Reputation Score" 
          fill="url(#barGradient)" 
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function IntentDistributionChart() {
  const OPACITIES = [0.9, 0.75, 0.6, 0.45];
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          {OPACITIES.map((opacity, index) => (
            <linearGradient key={`gradient-${index}`} id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREYS.primary} stopOpacity={opacity + 0.1}/>
              <stop offset="100%" stopColor={GREYS.primary} stopOpacity={opacity - 0.1}/>
            </linearGradient>
          ))}
        </defs>
        <Pie
          data={intentTypeData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${percent * 100 > 5 ? name : ''}`}
        >
          {intentTypeData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={`url(#pieGradient${index})`}
              stroke={GREYS.background}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          iconType="circle"
          layout="vertical"
          verticalAlign="middle"
          align="right"
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function IntentFulfillmentChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={fulfillmentData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="simpleGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={GREYS.primary} stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="mediumGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.lighter} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={GREYS.lighter} stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="complexGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.lightest} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={GREYS.lightest} stopOpacity={0.3}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GREYS.grid} />
        <XAxis 
          dataKey="name" 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <YAxis 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <Tooltip 
          content={<CustomTooltip />}
          formatter={(value) => [value, "hours"]}
        />
        <Legend iconType="circle" />
        <Area 
          type="monotone" 
          dataKey="simple" 
          name="Simple Tasks" 
          stackId="1" 
          stroke={GREYS.primary}
          strokeWidth={1.5}
          fill="url(#simpleGradient)"
        />
        <Area 
          type="monotone" 
          dataKey="medium" 
          name="Medium Tasks" 
          stackId="1" 
          stroke={GREYS.lighter}
          strokeWidth={1.5}
          fill="url(#mediumGradient)"
        />
        <Area 
          type="monotone" 
          dataKey="complex" 
          name="Complex Tasks" 
          stackId="1" 
          stroke={GREYS.lightest}
          strokeWidth={1.5}
          fill="url(#complexGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function NetworkActivityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart 
        data={networkData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <defs>
          <linearGradient id="connectionsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.primary} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={GREYS.primary} stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="messagesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={GREYS.darker} stopOpacity={0.1}/>
            <stop offset="95%" stopColor={GREYS.darker} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GREYS.grid} />
        <XAxis 
          dataKey="name" 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <YAxis 
          yAxisId="left" 
          stroke={GREYS.primary}
          tick={{ fill: GREYS.primary }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          stroke={GREYS.darker}
          tick={{ fill: GREYS.darker }}
          axisLine={{ stroke: GREYS.grid }}
          tickLine={{ stroke: GREYS.grid }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="connections"
          name="P2P Connections"
          stroke={GREYS.primary}
          strokeWidth={2.5}
          dot={{ stroke: GREYS.primary, strokeWidth: 2, r: 4, fill: "white" }}
          activeDot={{ r: 6, stroke: GREYS.primary, strokeWidth: 2, fill: "white" }}
          fill="url(#connectionsGradient)"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="messages"
          name="Messages"
          stroke={GREYS.darker}
          strokeWidth={2.5}
          strokeDasharray="5 5"
          dot={{ stroke: GREYS.darker, strokeWidth: 2, r: 4, fill: "white" }}
          activeDot={{ r: 6, stroke: GREYS.darker, strokeWidth: 2, fill: "white" }}
          fill="url(#messagesGradient)"
        />
      </LineChart>
    </ResponsiveContainer>
  )
} 