import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AccessGuard } from '@/components/AccessGuard'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useTelegramMiniApp } from '@/hooks/useTelegramMiniApp'
import { useI18n } from '@/i18n'
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
  const { locale, t } = useI18n()

  useTelegramMiniApp()

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t('app.documentTitle')
  }, [locale, t])

  return (
    <AccessGuard>
      <AppRoutes />
    </AccessGuard>
  )
}