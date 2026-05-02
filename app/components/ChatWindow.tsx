'use client'

import { useState, useRef, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Send, Loader2, AlertCircle } from 'lucide-react'

const CODE_BLOCK_REGEX = /```(?:(\w+)\n)?([\s\S]*?)```/g

function extractCodeBlocks(text: string) {
  const codeBlocks = []
  let match

  while ((match = CODE_BLOCK_REGEX.exec(text)) !== null) {
    codeBlocks.push({
      language: match[1] || 'plaintext',
      code: match[2].trim(),
    })
  }

  return codeBlocks
}

export function ChatWindow() {
  const { messages, addMessage, setCode, loading, error, setLoading, setError } = useStore()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }, 0)

    return () => clearTimeout(timer)
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || loading) return

    const userMsg = { role: 'user' as const, content: input }
    const userInput = input

    addMessage(userMsg)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          provider: 'gemini', // Can be made dynamic via UI
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'API request failed')
      }

      const data = await response.json()

      if (!data.content) {
        throw new Error('Empty response from API')
      }

      addMessage({ role: 'assistant', content: data.content })

      // Extract and set first code block if found
      const codeBlocks = extractCodeBlocks(data.content)
      if (codeBlocks.length > 0) {
        const firstBlock = codeBlocks[0]
        setCode(firstBlock.code, firstBlock.language)
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Chat error:', err)

      // Add error message to chat
      addMessage({
        role: 'assistant',
        content: `❌ Error: ${errorMessage}`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl lg:rounded-[24px] overflow-hidden shadow-2xl">
      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 custom-scrollbar"
      >
        {messages.length === 0 && !loading && (
          <div className="h-full flex items-center justify-center text-orange-400/50 text-center text-sm font-mono">
            <div>
              <p className="text-lg mb-2">💬 Welcome to HELLxCODER</p>
              <p className="text-xs text-orange-400/30">Ask anything. Code will appear on the right.</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 lg:px-5 py-3 rounded-lg lg:rounded-2xl text-sm lg:text-[14px] leading-relaxed break-words ${
                m.role === 'user'
                  ? 'bg-white/10 text-white'
                  : 'bg-white/5 text-blue-200'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
              <span className="text-xs text-white/50">Thinking...</span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-[85%]">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-400" />
              <span className="text-xs text-red-300">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 lg:p-4 border-t border-white/5 bg-black/20">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 lg:px-4 py-2 hover:border-white/20 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent py-2 outline-none text-sm placeholder:text-white/30 font-mono disabled:opacity-50"
            placeholder="Type your command..."
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin text-white/50" />
            ) : (
              <Send className="w-4 h-4 lg:w-5 lg:h-5 text-white/60 hover:text-white/90" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
