import { create } from 'zustand'

export type Message = {
  role: 'user' | 'assistant'
  content: string
}

interface StoreState {
  messages: Message[]
  code: string
  language: string
  loading: boolean
  error: string | null
  addMessage: (msg: Message) => void
  setCode: (code: string, lang: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearMessages: () => void
  clearCode: () => void
}

export const useStore = create<StoreState>((set) => ({
  messages: [],
  code: '',
  language: '',
  loading: false,
  error: null,

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
      error: null,
    })),

  setCode: (code, language) =>
    set({
      code,
      language,
      error: null,
    }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearMessages: () => set({ messages: [], code: '', language: '', error: null }),

  clearCode: () => set({ code: '', language: '' }),
}))

// Selectors for component isolation (optional but recommended)
export const useMessages = () => useStore((state) => state.messages)
export const useLoading = () => useStore((state) => state.loading)
export const useError = () => useStore((state) => state.error)
export const useCode = () => useStore((state) => ({ code: state.code, language: state.language }))
