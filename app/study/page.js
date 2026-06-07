"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"

export default function Study() {
  const [flashcards, setFlashcards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const docId = searchParams.get("doc")

  useEffect(() => {
    async function fetchFlashcards() {
      const supabase = createClient()

      const { data, error } = await supabase
        .from("flashcards")
        .select("*")
        .eq("document_id", docId)

      if (error || !data) {
        router.push("/dashboard")
        return
      }

      setFlashcards(data)
      setLoading(false)
    }

    if (docId) fetchFlashcards()
    else router.push("/dashboard")
  }, [docId])

  async function handleRating(rating) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    await supabase.from("card_reviews").insert({
      flashcard_id: flashcards[current].id,
      user_id: user.id,
      rating
    })

    if (current + 1 >= flashcards.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setFlipped(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading flashcards...</p>
      </main>
    )
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-12 text-center max-w-md w-full">
          <p className="text-5xl mb-4">🎉</p>
          <h1 className="text-3xl font-bold mb-2">Session complete</h1>
          <p className="text-gray-400 mb-8">You reviewed all {flashcards.length} cards.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Back to dashboard
          </button>
        </div>
      </main>
    )
  }

  const card = flashcards[current]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Study</h1>
          <p className="text-gray-400 text-sm">{current + 1} of {flashcards.length}</p>
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-gray-900 rounded-xl p-12 flex items-center justify-center text-center cursor-pointer hover:bg-gray-800 transition min-h-64 mb-6"
        >
          {flipped ? (
            <div>
              <p className="text-xs text-blue-400 uppercase tracking-widest mb-4">Answer</p>
              <p className="text-xl">{card.answer}</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Question</p>
              <p className="text-xl">{card.question}</p>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Click the card to flip it</p>

        {flipped && (
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => handleRating(1)} className="bg-red-900 hover:bg-red-800 text-red-200 py-3 rounded-lg text-sm font-medium transition">Again</button>
            <button onClick={() => handleRating(2)} className="bg-orange-900 hover:bg-orange-800 text-orange-200 py-3 rounded-lg text-sm font-medium transition">Hard</button>
            <button onClick={() => handleRating(3)} className="bg-blue-900 hover:bg-blue-800 text-blue-200 py-3 rounded-lg text-sm font-medium transition">Good</button>
            <button onClick={() => handleRating(4)} className="bg-green-900 hover:bg-green-800 text-green-200 py-3 rounded-lg text-sm font-medium transition">Easy</button>
          </div>
        )}
      </div>
    </main>
  )
}