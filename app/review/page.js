"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Review() {
  const [flashcards, setFlashcards] = useState([])
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)
  const [userId, setUserId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchDueCards() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUserId(user.id)

      const { data: docs } = await supabase
        .from("documents")
        .select("id")
        .eq("user_id", user.id)

      if (!docs || docs.length === 0) {
        setLoading(false)
        return
      }

      const docIds = docs.map(d => d.id)
      const today = new Date().toISOString()

      const { data: cards } = await supabase
        .from("flashcards")
        .select("*")
        .in("document_id", docIds)
        .lte("next_review_at", today)

      setFlashcards(cards || [])
      setLoading(false)
    }

    fetchDueCards()
  }, [])

  async function handleRating(rating) {
    await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flashcardId: flashcards[current].id,
        rating,
        userId
      })
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
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    )
  }

  if (flashcards.length === 0) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-gray-900 rounded-xl p-12 text-center max-w-md w-full">
            <p className="text-5xl mb-4">✅</p>
            <h1 className="text-2xl font-bold mb-2">You're all caught up</h1>
            <p className="text-gray-400 mb-8">No cards due today. Come back tomorrow.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="bg-gray-900 rounded-xl p-12 text-center max-w-md w-full">
            <p className="text-5xl mb-4">🎉</p>
            <h1 className="text-3xl font-bold mb-2">Revision complete</h1>
            <p className="text-gray-400 mb-8">You reviewed all {flashcards.length} due cards.</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </main>
    )
  }

  const card = flashcards[current]

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Today's Revision</h1>
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
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-400 text-sm whitespace-nowrap">I forgot</span>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleRating(val)}
                    className="w-10 h-10 rounded-full border-2 border-gray-600 hover:border-blue-400 hover:bg-blue-400 transition"
                  />
                ))}
              </div>
              <span className="text-gray-400 text-sm whitespace-nowrap">I knew it!</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}