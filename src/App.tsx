import { Navigate, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Workouts } from './pages/Workouts'
import { WorkoutDetail } from './pages/WorkoutDetail'
import { WorkoutPlayer } from './pages/WorkoutPlayer'
import { Profile } from './pages/Profile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/painel" replace />} />
      <Route path="/painel" element={<Dashboard />} />
      <Route path="/treinos" element={<Workouts />} />
      <Route path="/treinos/:slug" element={<WorkoutDetail />} />
      <Route path="/treinos/:slug/play" element={<WorkoutPlayer />} />
      <Route path="/perfil" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
