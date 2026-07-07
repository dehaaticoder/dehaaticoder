export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-green-400 mb-4">🌾 Dehaati Coder</h1>
      <p className="text-xl text-slate-400 mb-2">India's most beginner-friendly DSA platform</p>
      <p className="text-slate-500 mb-8">Brute → Better → Optimal. Explained like a friend, not a textbook.</p>
      <a href="/dehaaticoder/roadmap" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition">
        Start Learning →
      </a>
    </div>
  )
}
