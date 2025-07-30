"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertTriangle, XCircle, FileText, ChevronDown, ChevronUp, CheckCircle, Edit3 } from "lucide-react"

interface RiskCardProps {
  risk: {
    id: string
    type: "critical" | "warning" | "info"
    title: string
    description: string
    clause: string
    suggestion: string
    status: "pending" | "accepted" | "rejected"
  }
  onStatusChange?: (id: string, status: "accepted" | "rejected") => void
  onEdit?: (id: string) => void
  className?: string
}

export function RiskCard({ risk, onStatusChange, onEdit, className }: RiskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRiskIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "info":
        return <FileText className="h-5 w-5 text-blue-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const getRiskColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50 hover:bg-red-100"
      case "warning":
        return "border-orange-200 bg-orange-50 hover:bg-orange-100"
      case "info":
        return "border-blue-200 bg-blue-50 hover:bg-blue-100"
      default:
        return "border-gray-200 bg-gray-50 hover:bg-gray-100"
    }
  }

  const getRiskBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Critique</Badge>
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Attention</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Info</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Autre</Badge>
    }
  }

  return (
    <Card
      className={cn(
        "transition-all duration-200 cursor-pointer hover:shadow-md",
        getRiskColor(risk.type),
        risk.status === "accepted" && "ring-2 ring-green-500 bg-green-50",
        risk.status === "rejected" && "ring-2 ring-gray-400 bg-gray-50 opacity-60",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              {getRiskIcon(risk.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900 truncate">{risk.title}</h4>
                  {getRiskBadge(risk.type)}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{risk.description}</p>
              </div>
            </div>

            {/* Status indicator */}
            {risk.status === "accepted" && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
          </div>

          {/* Expand/Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center text-gray-600 hover:text-gray-900 bg-transparent"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Masquer les détails
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Voir les détails
              </>
            )}
          </Button>

          {/* Expanded content */}
          {isExpanded && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
              {/* Current clause */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Clause problématique :</h5>
                <div className="bg-white p-3 rounded border border-red-200 text-sm">
                  <p className="text-red-800 italic">"{risk.clause}"</p>
                </div>
              </div>

              {/* Suggestion */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Suggestion d'amélioration :</h5>
                <div className="bg-white p-3 rounded border border-green-200 text-sm">
                  <p className="text-green-800 italic">"{risk.suggestion}"</p>
                </div>
              </div>

              {/* Actions */}
              {risk.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 flex-1"
                    onClick={() => onStatusChange?.(risk.id, "accepted")}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accepter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onEdit?.(risk.id)}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onStatusChange?.(risk.id, "rejected")}
                  >
                    Ignorer
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
