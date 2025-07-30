"use client"

interface ErrorReport {
  message: string
  stack?: string
  url: string
  userAgent: string
  timestamp: string
  userId?: string
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: string
  userId?: string
}

class MonitoringService {
  private static instance: MonitoringService
  private errorQueue: ErrorReport[] = []
  private metricsQueue: PerformanceMetric[] = []

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }

  // Capturer les erreurs JavaScript
  captureError(error: Error, context?: Record<string, any>) {
    const errorReport: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
    }

    this.errorQueue.push(errorReport)
    this.flushErrors()

    // En production, envoyer à un service comme Sentry
    console.error("Error captured:", errorReport, context)
  }

  // Capturer les métriques de performance
  captureMetric(name: string, value: number) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
    }

    this.metricsQueue.push(metric)
    this.flushMetrics()
  }

  // Mesurer le temps d'exécution d'une fonction
  async measureTime<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      this.captureMetric(name, duration)
      return result
    } catch (error) {
      const duration = performance.now() - start
      this.captureMetric(`${name}_error`, duration)
      throw error
    }
  }

  // Capturer les métriques Web Vitals
  captureWebVitals() {
    // Core Web Vitals
    if ("web-vital" in window) {
      // @ts-ignore
      import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS((metric) => this.captureMetric("CLS", metric.value))
        getFID((metric) => this.captureMetric("FID", metric.value))
        getFCP((metric) => this.captureMetric("FCP", metric.value))
        getLCP((metric) => this.captureMetric("LCP", metric.value))
        getTTFB((metric) => this.captureMetric("TTFB", metric.value))
      })
    }
  }

  private getCurrentUserId(): string | undefined {
    try {
      const user = localStorage.getItem("user")
      return user ? JSON.parse(user).id : undefined
    } catch {
      return undefined
    }
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return

    try {
      // En production, envoyer à un service de monitoring
      await fetch("/api/monitoring/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ errors: this.errorQueue }),
      })
      this.errorQueue = []
    } catch (error) {
      console.error("Failed to flush errors:", error)
    }
  }

  private async flushMetrics() {
    if (this.metricsQueue.length === 0) return

    try {
      // En production, envoyer à un service d'analytics
      await fetch("/api/monitoring/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: this.metricsQueue }),
      })
      this.metricsQueue = []
    } catch (error) {
      console.error("Failed to flush metrics:", error)
    }
  }
}

export const monitoring = MonitoringService.getInstance()

// Hook pour capturer les erreurs React
export function useErrorHandler() {
  return (error: Error, context?: Record<string, any>) => {
    monitoring.captureError(error, context)
  }
}

// Hook pour mesurer les performances
export function usePerformanceMonitoring() {
  return {
    measureTime: monitoring.measureTime.bind(monitoring),
    captureMetric: monitoring.captureMetric.bind(monitoring),
  }
}
