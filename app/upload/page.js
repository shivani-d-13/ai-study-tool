"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"

export default function Upload() {
  const [title, setTitle] = useState("")
  const [text, setText] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  async function handleGenerate() {
    if (!title) {
      setError("Please add a title.")
      return
    }
    if (!text && !file) {
      setError("Please paste some text or upload a PDF.")
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

      let finalText = text

      if (file) {
        const formData = new FormData()
        formData.append("pdf", file)

        const pdfRes = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData
        })

        const pdfData = await pdfRes.json()

        if (pdfData.error) {
          setError(pdfData.error)
          setLoading(false)
          return
        }

        finalText = pdfData.text
      }

      const { data: doc, error: docError } = await supabase
        .from("documents")
        .insert({ title, raw_text: finalText, user_id: user.id })
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
        body: JSON.stringify({ text: finalText, title, docId: doc.id })
      })

      const data = await response.json()

      if (data.error) {
        await supabase.from("documents").delete().eq("id", doc.id)
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
          <p className="text-gray-400 mb-8">Upload a PDF or paste your notes to generate flashcards.</p>

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
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 mb-6"
          />

          <div
            className="bg-gray-900 rounded-xl p-8 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-center mb-6 cursor-pointer hover:border-blue-500 transition"
            onClick={() => document.getElementById("pdf-input").click()}
          >
            <p className="text-4xl mb-3">📄</p>
            <p className="text-white font-medium mb-1">
              {file ? file.name : "Drop your PDF here"}
            </p>
            <p className="text-gray-400 text-sm">
              {file ? "Click to change file" : "or click to browse"}
            </p>
            <input
              id="pdf-input"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                setFile(e.target.files[0])
                setText("")
              }}
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">or paste text</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <textarea
            placeholder="Paste your notes here..."
            rows={8}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setFile(null)
            }}
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