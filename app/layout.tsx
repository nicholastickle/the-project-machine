import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider/theme-provider'
import { AppProviders } from './providers';

export const metadata: Metadata = {
  title: 'Project Machine',
  description: 'Turn conversations into actionable project plans. AI project manager that creates tasks, estimates time, and organizes workflows.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
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
        <meta name="apple-mobile-web-app-title" content="Project Machine" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >

          <AppProviders>
          {children}
        </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}



