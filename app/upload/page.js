"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Upload() {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleGenerate() {
    if (!text || !title) {
      setError("Please add a title and some text.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: doc, error: docError } = await supabase
        .from("documents")
        .insert({ title, raw_text: text, user_id: user.id })
        .select()
        .single()

      if (docError) {
        setError(docError.message)
        setLoading(false)
        return
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, title, docId: doc.id })
      })

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      const flashcards = data.flashcards.map(f => ({
        question: f.question,
        answer: f.answer,
        document_id: doc.id
      }))

      await supabase.from("flashcards").insert(flashcards)

      router.push("/dashboard")

    } catch (err) {
      setError("Something went wrong. Try again.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
          <p className="text-gray-400 mb-8">Paste your notes to generate flashcards.</p>

          {error && (
            <div className="bg-red-900 text-red-200 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Give this a title (e.g. Biology Chapter 3)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 mb-4"
          />

          <textarea
            placeholder="Paste your notes here..."
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 resize-none mb-6"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3 rounded-lg font-medium transition"
          >
            {loading ? "Generating flashcards..." : "Generate Flashcards"}
          </button>
        </div>
      </div>
    </main>
  )
}