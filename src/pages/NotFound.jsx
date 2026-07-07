import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-6xl font-bold text-green-400 mb-4">404</h1>
      <p className="text-slate-400 text-xl mb-8">Page not found</p>
      <Link to="/dehaaticoder/" className="text-green-400 hover:underline">← Back to Home</Link>
    </div>
  )
}
