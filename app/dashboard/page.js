"use client"

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-8">Welcome back. Here's your progress.</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Cards reviewed today</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Day streak</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-gray-400 text-sm mb-1">Total flashcards</p>
            <p className="text-3xl font-bold">0</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your documents</h2>
          <a href="/upload" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
            + Upload new
          </a>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 text-center">
          <p className="text-gray-400">No documents yet.</p>
          <p className="text-gray-600 text-sm mt-1">Upload your first set of notes to get started.</p>
        </div>
      </div>
    </main>
  )
}