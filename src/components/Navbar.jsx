import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()
  const isActive = (path) => pathname === path

  return (
    <nav className="border-b border-stone-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/dehaaticoder/" className="flex items-center gap-2 font-bold text-xl text-stone-800">
          🌾 <span>Dehaati Coder</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-stone-500">
          <Link
            to="/dehaaticoder/roadmap"
            className={`transition ${isActive('/dehaaticoder/roadmap') ? 'text-green-600 font-semibold' : 'hover:text-green-600'}`}
          >
            Roadmap
          </Link>
          <Link
            to="/dehaaticoder/cheatsheet/backtracking"
            className={`transition ${pathname.startsWith('/dehaaticoder/cheatsheet') ? 'text-green-600 font-semibold' : 'hover:text-green-600'}`}
          >
            Cheatsheets
          </Link>
          <Link
            to="/dehaaticoder/"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </nav>
  )
}
