import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useFlowStore } from '@/hooks/useFlowStore'
import OtpPage from '@/pages/OtpPage'
import ResultPage from '@/pages/ResultPage'
import SubmitPage from '@/pages/SubmitPage'
import WelcomePage from '@/pages/WelcomePage'

export function AppRoutes() {
  const hydrateDraft = useFlowStore((state) => state.hydrateDraft)

  useEffect(() => {
    hydrateDraft()
  }, [hydrateDraft])

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/submit" element={<SubmitPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/result" element={<ResultPage />} />
    </Routes>
  )
}

export default function App() {
  return <AppRoutes />
}
