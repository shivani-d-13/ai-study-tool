"use client"

import { useState } from "react"

export default function Study() {
  const [flipped, setFlipped] = useState(false)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Study</h1>
          <p className="text-gray-400 text-sm">Card 1 of 10</p>
        </div>

        <div
          onClick={() => setFlipped(!flipped)}
          className="bg-gray-900 rounded-xl p-12 flex items-center justify-center text-center cursor-pointer hover:bg-gray-800 transition min-h-64 mb-6"
        >
          {flipped ? (
            <div>
              <p className="text-xs text-blue-400 uppercase tracking-widest mb-4">Answer</p>
              <p className="text-xl">This is the answer to the flashcard.</p>
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Question</p>
              <p className="text-xl">This is the front of the flashcard. Click to flip.</p>
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 text-sm mb-6">Click the card to flip it</p>

        {flipped && (
          <div className="grid grid-cols-4 gap-3">
            <button className="bg-red-900 hover:bg-red-800 text-red-200 py-3 rounded-lg text-sm font-medium transition">
              Again
            </button>
            <button className="bg-orange-900 hover:bg-orange-800 text-orange-200 py-3 rounded-lg text-sm font-medium transition">
              Hard
            </button>
            <button className="bg-blue-900 hover:bg-blue-800 text-blue-200 py-3 rounded-lg text-sm font-medium transition">
              Good
            </button>
            <button className="bg-green-900 hover:bg-green-800 text-green-200 py-3 rounded-lg text-sm font-medium transition">
              Easy
            </button>
          </div>
        )}
      </div>
    </main>
  )
}