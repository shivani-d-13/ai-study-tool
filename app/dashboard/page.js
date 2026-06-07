"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [documents, setDocuments] = useState([])
  const [flashcardCount, setFlashcardCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      const { count } = await supabase
        .from("flashcards")
        .select("*", { count: "exact", head: true })
        .in("document_id", docs?.map(d => d.id) || [])

      setDocuments(docs || [])
      setFlashcardCount(count || 0)
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome back. Here's your progress.</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total documents</p>
            <p className="text-3xl font-bold">{documents.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total flashcards</p>
            <p className="text-3xl font-bold">{flashcardCount}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your documents</h2>
          <a href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            + Upload new
          </a>
        </div>

        {documents.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 text-center">
            <p className="text-gray-400">No documents yet.</p>
            <p className="text-gray-600 text-sm mt-1">Upload your first set of notes to get started.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className="bg-gray-900 rounded-xl p-6 flex items-center justify-between hover:bg-gray-800 transition cursor-pointer"
                onClick={() => router.push(`/study?doc=${doc.id}`)}
              >
                <div>
                  <p className="font-medium text-white">{doc.title}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-blue-400 text-sm">Study →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}