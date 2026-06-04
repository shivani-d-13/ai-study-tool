"use client"

export default function Upload() {
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Upload Notes</h1>
        <p className="text-gray-400 mb-8">Upload a PDF or paste your notes to generate flashcards.</p>

        <div className="bg-gray-900 rounded-xl p-8 border-2 border-dashed border-gray-700 flex flex-col items-center justify-center text-center mb-6 cursor-pointer hover:border-blue-500 transition">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-white font-medium mb-1">Drop your PDF here</p>
          <p className="text-gray-400 text-sm">or click to browse</p>
          <input type="file" accept=".pdf" className="hidden" />
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-700"></div>
          <span className="text-gray-400 text-sm">or paste text</span>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

        <textarea
          placeholder="Paste your notes here..."
          rows={6}
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 resize-none mb-6"
        />

        <input
          type="text"
          placeholder="Give this a title (e.g. Biology Chapter 3)"
          className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 mb-6"
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition">
          Generate Flashcards
        </button>
      </div>
    </main>
  )
}