import { NextResponse } from "next/server"
import { extractText } from "unpdf"

export const runtime = "nodejs"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf")

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Could not extract text. Try pasting instead." }, { status: 400 })
    }

    return NextResponse.json({ text: text.slice(0, 12000) })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to parse PDF." }, { status: 500 })
  }
}