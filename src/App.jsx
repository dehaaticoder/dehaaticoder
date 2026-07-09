import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import Topic from './pages/Topic'
import Problem from './pages/Problem'
import Cheatsheet from './pages/Cheatsheet'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dehaaticoder/" element={<Home />} />
        <Route path="/dehaaticoder/roadmap" element={<Roadmap />} />
        <Route path="/dehaaticoder/topic/:slug" element={<Topic />} />
        <Route path="/dehaaticoder/problem/:slug" element={<Problem />} />
        <Route path="/dehaaticoder/cheatsheet/:topic" element={<Cheatsheet />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
