import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"
import { NextResponse } from "next/server"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" })

export async function POST(req: Request) {
  try {
    const { messages, provider = "gemini" } = await req.json()

    // Validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required and must not be empty" },
        { status: 400 }
      )
    }

    const lastMessage = messages[messages.length - 1]?.content
    if (!lastMessage || typeof lastMessage !== "string") {
      return NextResponse.json(
        { error: "Last message must contain valid content" },
        { status: 400 }
      )
    }

    // Build conversation context (removes internal role properties for API)
    const conversationContext = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }))

    // --- OPTION 1: GEMINI ---
    if (provider === "gemini") {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction:
          "You are HELLxCODER AI, an expert code assistant. Be brief, objective, and provide working code examples. When providing code, wrap it in triple backticks with language identifier: ```javascript\ncode here\n```",
      })

      // For Gemini, concatenate context into single prompt
      const contextPrompt =
        messages.length > 1
          ? `Previous context:\n${messages
              .slice(0, -1)
              .map((m: any) => `${m.role}: ${m.content}`)
              .join("\n")}\n\nCurrent question: ${lastMessage}`
          : lastMessage

      const result = await model.generateContent(contextPrompt)
      const responseText = result.response.text()

      return NextResponse.json({
        role: "assistant",
        content: responseText,
      })
    }

    // --- OPTION 2: GROQ (Llama 3.3) ---
    if (provider === "groq") {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are HELLxCODER AI, an expert code assistant. Be brief, objective, and provide working code examples. When providing code, wrap it in triple backticks with language identifier: ```javascript\ncode here\n```",
          },
          ...conversationContext,
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
      })

      const content = completion.choices[0]?.message?.content

      if (!content) {
        return NextResponse.json(
          { error: "No response from Groq API" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        role: "assistant",
        content,
      })
    }

    return NextResponse.json(
      { error: "Invalid provider specified" },
      { status: 400 }
    )
  } catch (error: any) {
    console.error("API Route Error:", error)
    return NextResponse.json(
      {
        error:
          error.message || "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}
