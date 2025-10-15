import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://projectmachine.com'),

  title: 'Project Machine - Legal',
  description: 'Legal information, privacy policy, terms of service, and data security policies for Project Machine - Your AI Project Manager.',
  keywords: ['privacy policy', 'terms of service', 'legal', 'data security', 'cookies', 'project machine'],
  authors: [{ name: 'Project Machine Legal Team' }],
  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'Project Machine - Legal Information',
    description: 'Privacy policy, terms of service, and legal information for Project Machine AI project management platform.',
    type: 'website',
    locale: 'en_GB',
  },
  
  twitter: {
    card: 'summary',
    title: 'Project Machine - Legal Information',
    description: 'Privacy policy, terms of service, and legal information for Project Machine.',
  },
}

export default function LegalLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="legal-layout">
      {children}
    </div>
  )
}
