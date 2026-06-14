"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"

export default function Navbar() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex items-center justify-between">
      <Link href="/dashboard" className="text-white font-bold text-lg">
        AI Study Tool
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition">
          Dashboard
        </Link>
        <Link href="/upload" className="text-gray-400 hover:text-white text-sm transition">
          Upload
        </Link>
        <button
          onClick={handleLogout}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          Log out
        </button>
      </div>
    </nav>
  )
}