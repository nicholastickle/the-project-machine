import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import '../globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://projectmachine.com'),
  title: {
    template: '%s | Legal - Project Machine',
    default: 'Legal Information - Project Machine'
  },
  description: 'Legal information, privacy policy, terms of service, and data security policies for Project Machine - Your AI Project Manager.',
  keywords: ['privacy policy', 'terms of service', 'legal', 'data security', 'cookies', 'project machine'],
  authors: [{ name: 'Project Machine Legal Team' }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Legal Information - Project Machine',
    description: 'Privacy policy, terms of service, and legal information for Project Machine AI project management platform.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Legal Information - Project Machine',
    description: 'Privacy policy, terms of service, and legal information for Project Machine.',
  },
}

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
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
        {children}
      </body>
    </html>
  )
}
