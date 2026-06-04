export default function Register() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-gray-400 mb-6">Start studying smarter</p>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition mt-2">
            Create account
          </button>
        </div>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  )
}