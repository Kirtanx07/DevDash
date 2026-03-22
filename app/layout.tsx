import type { Metadata } from 'next'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'CYBERSPACE // Dev Dashboard',
  description: 'Your personalized cyber workspace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link
            href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <SignedIn>{children}</SignedIn>
          <SignedOut><RedirectToSignIn /></SignedOut>
        </body>
      </html>
    </ClerkProvider>
  )
}
