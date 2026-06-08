# AI Study Tool

Upload your notes and get AI-generated flashcards and quizzes instantly.

🔗 Live: https://ai-study-tool-gules.vercel.app

## What it does

- Upload study notes as text
- AI generates 8 flashcards and 4 quiz questions automatically
- Study flashcards with spaced repetition (rate each card: Again / Hard / Good / Easy)
- Take a quiz and see your score
- All data saved per user account

## Tech stack

- **Frontend** — Next.js 14, Tailwind CSS
- **Backend** — Next.js API routes
- **Database** — Supabase (PostgreSQL)
- **AI** — Groq API (Llama 3.3 70B)
- **Auth** — Supabase Auth
- **Deployment** — Vercel

## Running locally

1. Clone the repo
2. Run `npm install`
3. Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```
4. Run `npm run dev`
5. Open `localhost:3000`