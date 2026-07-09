import { BadgeCheck, CircleAlert, ExternalLink, RotateCcw, X } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useFlowStore } from '@/hooks/useFlowStore'
import { closeTelegramMiniApp, showConfirm, triggerHaptic } from '@/utils/telegram'

export default function ResultPage() {
  const navigate = useNavigate()
  const { resultStatus, resultRef, errorMessage, sessionId, resetFlow } = useFlowStore((state) => state)

  useEffect(() => {
    if (!sessionId) {
      navigate('/submit', { replace: true })
    }
  }, [sessionId, navigate])

  const isSuccess = resultStatus === 'success'

  const handleClose = () => {
    showConfirm('确定要关闭 Mini App 吗？', (ok) => {
      if (!ok) {
        return
      }

      const closed = closeTelegramMiniApp()

      if (!closed) {
        useFlowStore.setState({ toast: '当前为浏览器预览模式，无法真正关闭 Telegram Mini App。' })
      }

      triggerHaptic(isSuccess ? 'success' : 'warning')
    })
  }

  const handleRestart = () => {
    resetFlow()
    triggerHaptic('light')
    navigate('/submit')
  }

  return (
    <MiniAppShell
      title="上线结果"
      label="完成"
      showBack
      onBack={() => navigate('/otp')}
      footer={
        <>
          <AppButton onClick={handleClose}>
            <X className="h-4 w-4" />
            关闭 Mini App
          </AppButton>
          <AppButton variant="secondary" onClick={handleRestart}>
            <RotateCcw className="h-4 w-4" />
            重新上线
          </AppButton>
          {!isSuccess ? (
            <AppButton variant="secondary" onClick={() => navigate('/otp')}>
              <ExternalLink className="h-4 w-4" />
              返回 OTP 重试
            </AppButton>
          ) : null}
        </>
      }
    >
      <div className="grid min-h-[28rem] place-items-center text-center">
        <div className="space-y-5">
          <div
            className={[
              'mx-auto flex h-24 w-24 items-center justify-center rounded-full border',
              isSuccess
                ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300',
            ].join(' ')}
          >
            {isSuccess ? <BadgeCheck className="h-12 w-12" /> : <CircleAlert className="h-12 w-12" />}
          </div>

          <div className="space-y-3">
            <h2 className="font-display text-[2rem] font-extrabold tracking-[-0.05em] text-slate-950 dark:text-white">
              {isSuccess ? '上线成功' : '上线失败'}
            </h2>
            <p className="mx-auto max-w-[18rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
              {isSuccess ? '账号已经成功上线，可以返回 Telegram 继续后续操作。' : errorMessage || '校验未通过，请重新确认 OTP 或重新发起流程。'}
            </p>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/80 px-5 py-4 text-left shadow-sm dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">结果编号</p>
            <p className="mt-2 font-mono text-base text-slate-900 dark:text-white">{resultRef || '等待生成'}</p>
          </div>
        </div>
      </div>
    </MiniAppShell>
  )
}