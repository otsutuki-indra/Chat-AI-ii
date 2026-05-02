'use client'

import { ChatWindow } from './components/ChatWindow'
import CodePreview from './components/CodePreview'
import { useStore } from './store/useStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const { code } = useStore()

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,1)_0%,#020408_100%)]" />

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-8 px-4 lg:px-6">
        {/* Header - Fixed at top */}
        <header className="text-center space-y-2 flex-shrink-0">
          <h1 className="text-3xl md:text-4xl font-bold tracking-[0.5em] text-red-600 flex items-center justify-center gap-2">
            H E L L x C O D E R <span className="text-2xl md:text-3xl opacity-90">🧠</span>
          </h1>
          <p className="text-green-400 font-mono text-xs tracking-[0.4em] uppercase">🔌 START WRITING</p>
        </header>

        {/* Main Content - Centered with growth */}
        <main className="flex-1 w-full max-w-7xl flex items-center justify-center overflow-hidden">
          <motion.div 
            layout
            className={`flex flex-col lg:flex-row gap-4 lg:gap-6 w-full h-full transition-all duration-500 ease-out ${
              code ? 'lg:max-w-full' : 'lg:max-w-2xl'
            }`}
          >
            {/* Chat Panel */}
            <div className="flex-1 h-[55vh] lg:h-[65vh] min-w-0">
              <ChatWindow />
            </div>

            {/* Code Panel - Animated Entry */}
            <AnimatePresence>
              {code && (
                <motion.div 
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex-1 h-[55vh] lg:h-[65vh] min-w-0"
                >
                  <CodePreview />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>

        {/* Footer - Fixed at bottom */}
        <footer className="text-center space-y-1 flex-shrink-0 select-none">
          <p className="text-white/40 font-light tracking-[0.3em] text-[10px]">➜ made By HELLXSTUDIO.</p>
          <p className="text-red-700/70 text-[9px] uppercase font-bold tracking-widest">All rights reversed</p>
        </footer>
      </div>
    </div>
  )
}
