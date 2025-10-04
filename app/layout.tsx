import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider/theme-provider'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://projectmachine.com'),
  title: {
    template: '%s | Project Machine',
    default: 'Project Machine - AI Project Manager & Canvas Planning Platform'
  },
  description: 'Transform your project management with Project Machine. AI-powered canvas planning for early project plans, task durations, risk assessment, and resource allocation. Start planning smarter today.',
  keywords: ['AI project manager', 'canvas planning', 'project management', 'task planning', 'risk assessment', 'resource allocation', 'project planning software', 'AI planning tool'],
  authors: [
    { name: 'Nicholas Tickle', url: 'https://linkedin.com/in/nicholastickle' },
    { name: 'Brighton Tandabantu', url: 'https://linkedin.com/in/bthanda' }
  ],
  creator: 'Project Machine Team',
  publisher: 'Project Machine',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://projectmachine.com',
    siteName: 'Project Machine',
    title: 'Project Machine - AI Project Manager & Canvas Planning Platform',
    description: 'Transform your project management with AI-powered canvas planning. Create early project plans, assess risks, and allocate resources intelligently.',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Project Machine - AI Project Manager',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@projectmachine',
    creator: '@TickleNicholas',
    title: 'Project Machine - AI Project Manager & Canvas Planning',
    description: 'AI-powered project management with canvas planning. Create smarter project plans with intelligent task durations and risk assessment.',
    images: ['/images/twitter-image.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://projectmachine.com',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
           <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
