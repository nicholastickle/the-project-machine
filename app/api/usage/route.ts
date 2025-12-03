import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const USAGE_FILE = path.join(process.cwd(), 'usage-log.json');

interface UsageLog {
  sessions: {
    timestamp: string;
    duration?: number;
    model: string;
  }[];
  totalSessions: number;
  lastReset: string;
}

function getUsageLog(): UsageLog {
  try {
    if (fs.existsSync(USAGE_FILE)) {
      const data = fs.readFileSync(USAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to read usage log:', error);
  }
  
  return {
    sessions: [],
    totalSessions: 0,
    lastReset: new Date().toISOString(),
  };
}

function saveUsageLog(log: UsageLog) {
  try {
    fs.writeFileSync(USAGE_FILE, JSON.stringify(log, null, 2));
  } catch (error) {
    console.error('Failed to save usage log:', error);
  }
}

export async function POST(request: Request) {
  try {
    const { action, model, duration } = await request.json();
    const log = getUsageLog();

    if (action === 'start') {
      log.sessions.push({
        timestamp: new Date().toISOString(),
        model: model || 'gpt-4o-mini-realtime-preview-2024-12-17',
      });
      log.totalSessions += 1;
    } else if (action === 'end' && duration) {
      // Update the last session with duration
      const lastSession = log.sessions[log.sessions.length - 1];
      if (lastSession) {
        lastSession.duration = duration;
      }
    }

    saveUsageLog(log);
    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Usage tracking error:', error);
    return NextResponse.json(
      { error: 'Failed to log usage' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const log = getUsageLog();
  
  // Calculate stats
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = log.sessions.filter(s => 
    s.timestamp.startsWith(today)
  ).length;
  
  const totalDuration = log.sessions.reduce((sum, s) => 
    sum + (s.duration || 0), 0
  );
  
  return NextResponse.json({
    totalSessions: log.totalSessions,
    todaySessions,
    totalDurationSeconds: Math.round(totalDuration / 1000),
    recentSessions: log.sessions.slice(-10).reverse(),
  });
}
