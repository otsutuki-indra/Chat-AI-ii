'use client'

import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground h-screen w-screen overflow-hidden">
        <div className="h-screen w-screen flex flex-col items-center justify-center">
          {children}
        </div>
      </body>
    </html>
  )
}
