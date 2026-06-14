"use client"

import { Suspense } from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"

function QuizContent() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const docId = searchParams.get("doc")

  useEffect(() => {
    async function fetchQuestions() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("document_id", docId)

      if (error || !data || data.length === 0) {
        router.push("/dashboard")
        return
      }

      setQuestions(data)
      setLoading(false)
    }

    if (docId) fetchQuestions()
    else router.push("/dashboard")
  }, [docId])

  function handleAnswer(index) {
    if (selected !== null) return
    setSelected(index)
    if (index === questions[current].answer) {
      setScore(score + 1)
    }
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-400">Loading quiz...</p>
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
            <h1 className="text-3xl font-bold mb-2">Quiz complete</h1>
            <p className="text-gray-400 mb-6">You scored</p>
            <p className="text-5xl font-bold text-blue-400 mb-8">
              {score} / {questions.length}
            </p>
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

  const q = questions[current]

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Quiz</h1>
            <p className="text-gray-400 text-sm">{current + 1} of {questions.length}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Question</p>
            <p className="text-xl font-medium">{q.question}</p>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {q.options.map((option, index) => {
              let style = "bg-gray-900 hover:bg-gray-800 border border-gray-700"
              if (selected !== null) {
                if (index === q.answer) style = "bg-green-900 border border-green-600"
                else if (index === selected) style = "bg-red-900 border border-red-600"
                else style = "bg-gray-900 border border-gray-700 opacity-50"
              }
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`${style} text-white px-6 py-4 rounded-lg text-left transition`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {selected !== null && (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              {current + 1 >= questions.length ? "See results" : "Next question"}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

export default function Quiz() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    }>
      <QuizContent />
    </Suspense>
  )
}