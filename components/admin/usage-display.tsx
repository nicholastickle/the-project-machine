"use client"

import { useEffect, useState } from "react"
import { Activity, Clock, TrendingUp } from "lucide-react"

interface UsageStats {
  totalSessions: number
  todaySessions: number
  totalDurationSeconds: number
  recentSessions: {
    timestamp: string
    duration?: number
    model: string
  }[]
}

export function UsageDisplay() {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/usage')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch usage stats:', error)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Update every 10s

    return () => clearInterval(interval)
  }, [])

  // Toggle with Ctrl+Shift+U
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'U') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-[240px] right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
        title="Toggle usage stats (or Ctrl+Shift+U)"
      >
        <Activity className="w-5 h-5" />
      </button>

      {/* Stats panel */}
      {isVisible && stats && (
        <div className="fixed bottom-[300px] right-4 z-50 bg-gray-900 backdrop-blur-md border-2 border-gray-700 rounded-xl p-4 shadow-2xl w-64">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            Usage Stats
          </h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Today
              </span>
              <span className="font-semibold text-white">{stats.todaySessions}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300">Total Sessions</span>
              <span className="font-semibold text-white">{stats.totalSessions}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Total Time
              </span>
              <span className="font-semibold text-white">
                {Math.floor(stats.totalDurationSeconds / 60)}m {stats.totalDurationSeconds % 60}s
              </span>
            </div>
          </div>

          {stats.recentSessions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Recent Sessions</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {stats.recentSessions.slice(0, 5).map((session, i) => (
                  <div key={i} className="text-xs text-gray-300 flex justify-between">
                    <span>{new Date(session.timestamp).toLocaleTimeString()}</span>
                    <span>{session.duration ? `${Math.round(session.duration / 1000)}s` : '•'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Model: gpt-4o-mini-realtime
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Ctrl+Shift+U to toggle
            </p>
          </div>
        </div>
      )}
    </>
  )
}
