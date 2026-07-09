import { Eye, EyeOff, KeyRound, UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { FormField } from '@/components/FormField'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useMainButton } from '@/hooks/useMainButton'
import { enableClosingConfirmation, disableClosingConfirmation, triggerHaptic } from '@/utils/telegram'

export default function SubmitPage() {
  const navigate = useNavigate()
  const {
    account,
    pin,
    pinVisible,
    sessionId,
    submittingStep,
    setAccount,
    setPin,
    togglePinVisibility,
    submitAccountStep,
  } = useFlowStore((state) => state)

  const canSubmit = account.trim().length >= 3 && pin.length >= 4 && submittingStep !== 'account'

  const handleSubmit = async () => {
    const success = await submitAccountStep()

    if (success) {
      triggerHaptic('success')
      navigate('/otp')
    } else {
      triggerHaptic('warning')
    }
  }

  useMainButton({
    text: '提交账号信息',
    visible: canSubmit,
    disabled: !canSubmit,
    loading: submittingStep === 'account',
    onClick: handleSubmit,
  })

  useEffect(() => {
    if (sessionId) {
      navigate('/otp', { replace: true })
      return
    }

    enableClosingConfirmation()
    return () => disableClosingConfirmation()
  }, [sessionId, navigate])

  return (
    <MiniAppShell
      title="提交账号信息"
      label="Step 1"
      showBack
      onBack={() => navigate('/')}
      footer={
        <AppButton
          loading={submittingStep === 'account'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          提交账号信息
        </AppButton>
      }
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <h2 className="font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
            提交账号与 PIN
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            请输入上线账号与 PIN。账号会自动保存；出于安全考虑，PIN 在刷新后需要重新输入。
          </p>
        </div>

        <div className="grid gap-4">
          <FormField label="上线账号" hint="支持字母、数字和空格，最少 3 个字符。">
            <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
              <UserRound className="h-5 w-5 text-slate-400" />
              <input
                value={account}
                onChange={(event) => setAccount(event.target.value.slice(0, 32))}
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="请输入上线账号"
                autoComplete="username"
              />
            </div>
          </FormField>

          <FormField label="PIN" hint="仅允许数字输入，至少 4 位，最多 8 位。">
            <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
              <KeyRound className="h-5 w-5 text-slate-400" />
              <input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                placeholder="请输入 PIN"
                inputMode="numeric"
                type={pinVisible ? 'text' : 'password'}
              />
              <button
                type="button"
                onClick={togglePinVisibility}
                className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-sky-500/10 dark:hover:text-sky-200"
                aria-label="切换 PIN 可见性"
              >
                {pinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </FormField>
        </div>

        <div className="rounded-[1.75rem] border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-500/20 dark:bg-sky-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 dark:text-sky-200">链路说明</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            本次提交会获取一个临时会话 ID，随后进入 OTP 验证页完成最终上线。
          </p>
        </div>
      </div>
    </MiniAppShell>
  )
}