import Groq from "groq-sdk"

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request) {
  try {
    const { text, title } = await request.json()

    if (!text) {
      return Response.json({ error: "No text provided" }, { status: 400 })
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a study assistant. Based on the following notes, generate exactly 8 flashcards and 4 quiz questions.

Respond ONLY with a JSON object in this exact format, no other text:
{
  "flashcards": [
    { "question": "...", "answer": "..." }
  ],
  "quiz": [
    {
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": 0
    }
  ]
}

Notes:
${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2048,
    })

    const raw = completion.choices[0].message.content
    const parsed = JSON.parse(raw)

    return Response.json(parsed)

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Failed to generate flashcards" }, { status: 500 })
  }
}