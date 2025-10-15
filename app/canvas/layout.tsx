
export const metadata = {
  metadataBase: new URL('https://projectmachine.com'),
  title: 'Project Machine - Project Canvas',
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

  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
  openGraph: {
    title: 'Project Machine - Project Canvas',
    description: 'Interactive canvas for AI-powered project planning with flow diagrams, task management, and intelligent duration estimation.',
    type: 'website',
    locale: 'en_GB',
    siteName: 'Project Machine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Project Machine - Project Canvas',
    description: 'Create, plan, and manage projects with AI assistance using our interactive canvas interface.',
  },
}

export default function CanvasLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <div className="canvas-layout">
        {children}
      </div>
    </main>

  )
}


