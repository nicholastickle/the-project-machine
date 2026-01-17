import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://projectmachine.com'),

  title: 'Project Machine - Authentication',
  description: 'Sign up/sign in to project machine',
  keywords: ['authentication', 'sign up', 'sign in', 'project machine'],
  authors: [{ name: 'Project Machine' }],
  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: 'Project Machine - Authentication',
    description: 'Sign up/sign in to project machine',
    type: 'website',
    locale: 'en_GB',
  },
  
  twitter: {
    card: 'summary',
    title: 'Project Machine - Authentication',
    description: 'Sign up/sign in to project machine',
  },
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  )
}