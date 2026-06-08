import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-4">AI Study Tool</h1>
      <p className="text-gray-400 text-lg mb-8">Upload your notes. Get flashcards instantly.</p>
      <div className="flex gap-4">
        <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition">
          Get Started
        </Link>
        <Link href="/login" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition">
          Log in
        </Link>
      </div>
    </main>
  )
}