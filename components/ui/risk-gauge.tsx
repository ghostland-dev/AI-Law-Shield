"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface RiskGaugeProps {
  score: number
  size?: "sm" | "md" | "lg"
  animated?: boolean
  className?: string
}

export function RiskGauge({ score, size = "md", animated = true, className }: RiskGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setAnimatedScore(score), 100)
      return () => clearTimeout(timer)
    } else {
      setAnimatedScore(score)
    }
  }, [score, animated])

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const getColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    if (score >= 40) return "text-orange-600"
    return "text-red-600"
  }

  const getGradient = (score: number) => {
    if (score >= 80) return "from-green-400 to-green-600"
    if (score >= 60) return "from-yellow-400 to-yellow-600"
    if (score >= 40) return "from-orange-400 to-orange-600"
    return "from-red-400 to-red-600"
  }

  const circumference = 2 * Math.PI * 40
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-gray-200" />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={cn("stop-color", getGradient(score).split(" ")[0].replace("from-", ""))} />
            <stop offset="100%" className={cn("stop-color", getGradient(score).split(" ")[1].replace("to-", ""))} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div
            className={cn(
              "font-bold",
              getColor(animatedScore),
              size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-2xl",
            )}
          >
            {Math.round(animatedScore)}
          </div>
          <div className={cn("text-gray-500", size === "sm" ? "text-xs" : "text-sm")}>/100</div>
        </div>
      </div>
    </div>
  )
}
