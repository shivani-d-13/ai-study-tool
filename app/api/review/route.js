import { createClient } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { flashcardId, rating, userId } = await request.json()

    if (!flashcardId || !rating || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    const supabase = createClient()

    const { data: card, error: fetchError } = await supabase
      .from("flashcards")
      .select("ease_factor, interval_days")
      .eq("id", flashcardId)
      .single()

    if (fetchError || !card) {
      return Response.json({ error: "Card not found" }, { status: 404 })
    }

    let { ease_factor, interval_days } = card

    if (rating < 3) {
      interval_days = 1
    } else {
      interval_days = Math.round(interval_days * ease_factor)
    }

    ease_factor = ease_factor + (0.1 - (4 - rating) * (0.08 + (4 - rating) * 0.02))
    ease_factor = Math.max(1.3, parseFloat(ease_factor.toFixed(2)))
    interval_days = Math.max(1, interval_days)

    const next_review_at = new Date()
    next_review_at.setDate(next_review_at.getDate() + interval_days)

    await supabase
      .from("flashcards")
      .update({ ease_factor, interval_days, next_review_at })
      .eq("id", flashcardId)

    await supabase.from("card_reviews").insert({
      flashcard_id: flashcardId,
      user_id: userId,
      rating
    })

    return Response.json({ ease_factor, interval_days, next_review_at })

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Server error" }, { status: 500 })
  }
}