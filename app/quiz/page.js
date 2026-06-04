"use client"

import { useState } from "react"

const mockQuestions = [
  {
    question: "What is the powerhouse of the cell?",
    options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
    answer: 1
  },
  {
    question: "What does DNA stand for?",
    options: ["Deoxyribonucleic acid", "Diribonucleic acid", "Deoxyribonitric acid", "None of the above"],
    answer: 0
  }
]

export default function Quiz() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  function handleAnswer(index) {
    if (selected !== null) return
    setSelected(index)
    if (index === mockQuestions[current].answer) {
      setScore(score + 1)
    }
  }

  function handleNext() {
    if (current + 1 >= mockQuestions.length) {
      setFinished(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
    }
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="bg-gray-900 rounded-xl p-12 text-center max-w-md w-full">
          <p className="text-5xl mb-4">🎉</p>
          <h1 className="text-3xl font-bold mb-2">Quiz complete</h1>
          <p className="text-gray-400 mb-6">You scored</p>
          <p className="text-5xl font-bold text-blue-400 mb-8">
            {score} / {mockQuestions.length}
          </p>
          <button
            onClick={() => { setCurrent(0); setSelected(null); setScore(0); setFinished(false) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Try again
          </button>
        </div>
      </main>
    )
  }

  const q = mockQuestions[current]

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Quiz</h1>
          <p className="text-gray-400 text-sm">
            {current + 1} of {mockQuestions.length}
          </p>
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
            {current + 1 >= mockQuestions.length ? "See results" : "Next question"}
          </button>
        )}
      </div>
    </main>
  )
}