import { useParams } from 'react-router-dom'

export default function Topic() {
  const { slug } = useParams()
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-400 capitalize">{slug}</h1>
      <p className="text-slate-400 mt-4">Topic page coming soon</p>
    </div>
  )
}
