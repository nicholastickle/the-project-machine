"use client"

import { useEffect, useState, useRef } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface AIStatusIndicatorProps {
    isConnected: boolean;
    isConnecting: boolean;
    isSpeaking: boolean;
    currentActivity?: string;
}

interface LogEntry {
    id: string;
    time: string;
    timestamp: number;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    icon?: string;
}

export function AIStatusIndicator({ isConnected, isConnecting, isSpeaking, currentActivity }: AIStatusIndicatorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [lastActivity, setLastActivity] = useState<string>('');
    const [activityLog, setActivityLog] = useState<LogEntry[]>([]);
    const logEndRef = useRef<HTMLDivElement>(null);
    const { open: sidebarOpen, isMobile } = useSidebar();

    useEffect(() => {
        if (currentActivity && currentActivity !== lastActivity) {
            setLastActivity(currentActivity);
            const now = Date.now();
            
            // Determine log type and icon based on activity
            let type: LogEntry['type'] = 'info';
            let icon = '•';
            
            if (currentActivity.includes('Creating') || currentActivity.includes('tasks')) {
                type = 'success';
                icon = '✓';
            } else if (currentActivity.includes('Error')) {
                type = 'error';
                icon = '✗';
            } else if (currentActivity.includes('Speaking') || currentActivity.includes('greeting')) {
                type = 'info';
                icon = '🎙';
            } else if (currentActivity.includes('Listening')) {
                type = 'info';
                icon = '👂';
            } else if (currentActivity.includes('Updating') || currentActivity.includes('Clearing')) {
                type = 'success';
                icon = '⚡';
            }
            
            const newLog: LogEntry = {
                id: `${now}-${Math.random()}`,
                time: new Date().toLocaleTimeString(),
                timestamp: now,
                message: currentActivity,
                type,
                icon
            };
            
            setActivityLog(prev => {
                const updated = [...prev, newLog];
                // Keep last 50 logs
                return updated.slice(-50);
            });
            
            // Auto-scroll to bottom when new log arrives
            setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
    }, [currentActivity, lastActivity]);

    // Auto-fade old logs (mark them as faded after 10 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setActivityLog(prev => 
                prev.filter(log => now - log.timestamp < 60000) // Remove logs older than 1 minute
            );
        }, 10000);
        return () => clearInterval(interval);
    }, []);

    if (process.env.NODE_ENV !== 'development') return null;

    const getStatusColor = () => {
        if (!isConnected && !isConnecting) return 'bg-gray-500';
        if (isConnecting) return 'bg-yellow-500 animate-pulse';
        if (isSpeaking) return 'bg-green-500 animate-pulse';
        return 'bg-blue-500';
    };

    const getStatusText = () => {
        if (!isConnected && !isConnecting) return 'Disconnected';
        if (isConnecting) return 'Connecting...';
        if (isSpeaking) return 'Speaking';
        if (currentActivity) return currentActivity;
        return 'Listening';
    };

    const getLogColor = (type: LogEntry['type']) => {
        switch (type) {
            case 'success': return 'text-green-400';
            case 'error': return 'text-red-400';
            case 'warning': return 'text-yellow-400';
            default: return 'text-blue-400';
        }
    };

    return (
        <div className={`fixed top-2.5 z-40 transition-all duration-300 ${!isMobile && sidebarOpen ? 'left-[320px]' : 'left-[60px] md:left-[115px]'}`}>
            {/* Compact Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-gray-900/95 backdrop-blur-md text-white rounded-lg px-3 py-2 font-mono text-xs hover:bg-gray-800 transition-colors border border-gray-700 shadow-xl"
            >
                <Activity className="w-3 h-3" />
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                <span className="font-semibold">{isOpen ? 'Activity Log' : getStatusText()}</span>
                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Expanded Log Panel */}
            {isOpen && (
                <div className="mt-2 bg-gray-900/95 backdrop-blur-md text-white rounded-lg p-3 font-mono text-xs max-w-md border border-gray-700 shadow-2xl">
                    {/* Status Header */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/20">
                        <div className="flex items-center gap-2">
                            <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor()}`}></div>
                            <span className="font-semibold text-sm">{getStatusText()}</span>
                        </div>
                        <div className="flex gap-3 text-[10px] text-gray-400">
                            <span>Connected: {isConnected ? '✓' : '✗'}</span>
                            <span>Speaking: {isSpeaking ? '✓' : '✗'}</span>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                        {activityLog.length === 0 ? (
                            <div className="text-gray-500 text-center py-4">No activity yet</div>
                        ) : (
                            <>
                                {activityLog.map((log, i) => {
                                    const age = Date.now() - log.timestamp;
                                    const isRecent = age < 3000; // Highlight logs less than 3 seconds old
                                    
                                    return (
                                        <div
                                            key={log.id}
                                            className={`flex items-start gap-2 py-1 px-2 rounded transition-all ${
                                                isRecent ? 'bg-white/5' : ''
                                            }`}
                                        >
                                            <span className="text-gray-500 text-[9px] leading-4 w-16 flex-shrink-0">
                                                {log.time}
                                            </span>
                                            <span className={`${getLogColor(log.type)} leading-4 flex-shrink-0`}>
                                                {log.icon}
                                            </span>
                                            <span className={`text-gray-300 leading-4 flex-1 ${
                                                isRecent ? 'font-semibold' : ''
                                            }`}>
                                                {log.message}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={logEndRef} />
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-3 pt-2 border-t border-white/20 text-[9px] text-gray-500 text-center">
                        {activityLog.length} events logged • Auto-clears after 1min
                    </div>
                </div>
            )}
        </div>
    );
}
