"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelineStep {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "pending" | "error"
  timestamp?: string
}

interface StatusTimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function StatusTimeline({ steps, className }: StatusTimelineProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "current":
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    }
  }

  const getLineColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "current":
        return "bg-blue-600"
      case "error":
        return "bg-red-600"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="relative flex items-start space-x-4">
          {/* Timeline line */}
          {index < steps.length - 1 && (
            <div className="absolute left-2.5 top-8 w-0.5 h-8 bg-gray-200">
              <div
                className={cn(
                  "w-full transition-all duration-500",
                  getLineColor(step.status),
                  step.status === "completed" ? "h-full" : "h-0",
                )}
              />
            </div>
          )}

          {/* Icon */}
          <div className="flex-shrink-0 mt-1">{getIcon(step.status)}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4
                className={cn(
                  "text-sm font-medium",
                  step.status === "completed"
                    ? "text-green-900"
                    : step.status === "current"
                      ? "text-blue-900"
                      : step.status === "error"
                        ? "text-red-900"
                        : "text-gray-500",
                )}
              >
                {step.title}
              </h4>
              {step.timestamp && <span className="text-xs text-gray-500">{step.timestamp}</span>}
            </div>
            <p
              className={cn(
                "text-sm mt-1",
                step.status === "completed"
                  ? "text-green-700"
                  : step.status === "current"
                    ? "text-blue-700"
                    : step.status === "error"
                      ? "text-red-700"
                      : "text-gray-500",
              )}
            >
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
