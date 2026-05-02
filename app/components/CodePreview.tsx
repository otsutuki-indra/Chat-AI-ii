'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useStore } from '../store/useStore'
import { Copy, Terminal, Check } from 'lucide-react'
import { useState } from 'react'

export default function CodePreview() {
  const { code, language } = useStore()
  const [copied, setCopied] = useState(false)

  if (!code) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="h-full flex flex-col glass-panel rounded-2xl lg:rounded-[24px] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 lg:px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-blue-400" />
          <span className="text-[10px] lg:text-[11px] font-mono text-white/50 uppercase tracking-widest">
            {language || 'plaintext'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 lg:p-2 hover:bg-white/10 rounded-lg transition-colors cursor-pointer group"
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={14} className="text-green-400" />
          ) : (
            <Copy size={14} className="text-white/50 group-hover:text-white/70" />
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <SyntaxHighlighter
          language={language || 'plaintext'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '20px',
            background: 'transparent',
            fontSize: '13px',
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.5',
          }}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
