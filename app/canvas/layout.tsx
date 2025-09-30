import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://projectmachine.com'),
  title: {
    template: '%s | Canvas - Project Machine',
    default: 'Project Canvas - AI Project Planning | Project Machine'
  },
  description: 'Interactive canvas for AI-powered project planning. Create flow diagrams, manage tasks, estimate durations, and collaborate with your AI project manager in real-time.',
  keywords: [
    'project planning canvas',
    'AI project manager',
    'flow diagrams',
    'project planning tool',
    'task management',
    'project visualization',
    'collaborative planning',
    'project timeline',
    'AI planning assistant',
    'project management software'
  ],
  authors: [
    { name: 'Project Machine Team' },
    { name: 'Nicholas Tickle', url: 'https://linkedin.com/in/nicholastickle' },
    { name: 'Brighton Tandabantu', url: 'https://linkedin.com/in/bthanda' }
  ],
  robots: {
    index: false, // Canvas pages are typically user-specific and shouldn't be indexed
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: 'Project Canvas - AI Project Planning',
    description: 'Interactive canvas for AI-powered project planning with flow diagrams, task management, and intelligent duration estimation.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Project Machine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Canvas - AI Project Planning',
    description: 'Create, plan, and manage projects with AI assistance using our interactive canvas interface.',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#ff8c00', // Orange theme color for the canvas
}

export default function CanvasLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="canvas-layout">
      {children}
    </div>
  )
}
