import { MessageSquareText, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { FormField } from '@/components/FormField'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useFlowStore } from '@/hooks/useFlowStore'
import { useMainButton } from '@/hooks/useMainButton'
import { enableClosingConfirmation, disableClosingConfirmation, triggerHaptic } from '@/utils/telegram'

export default function OtpPage() {
  const navigate = useNavigate()
  const { otp, sessionId, submittingStep, setOtp, verifyOtpStep } = useFlowStore((state) => state)

  const canSubmit = /^\d{6}$/.test(otp) && submittingStep !== 'otp'

  const handleSubmitOtp = async () => {
    const success = await verifyOtpStep()

    triggerHaptic(success ? 'success' : 'error')
    navigate('/result')
  }

  const handleResendOtp = () => {
    triggerHaptic('light')
    useFlowStore.setState({ toast: 'OTP 已重新发送，请留意短信。' })
  }

  useMainButton({
    text: '提交 OTP',
    visible: canSubmit,
    disabled: !canSubmit,
    loading: submittingStep === 'otp',
    onClick: handleSubmitOtp,
  })

  useEffect(() => {
    if (!sessionId) {
      navigate('/submit', { replace: true })
      return
    }

    enableClosingConfirmation()
    return () => disableClosingConfirmation()
  }, [sessionId, navigate])

  return (
    <MiniAppShell
      title="OTP 校验"
      label="Step 2"
      showBack
      onBack={() => navigate('/submit')}
      footer={
        <>
          <AppButton
            loading={submittingStep === 'otp'}
            disabled={!canSubmit}
            onClick={handleSubmitOtp}
          >
            提交 OTP
          </AppButton>
          <AppButton
            variant="secondary"
            onClick={handleResendOtp}
          >
            <RotateCcw className="h-4 w-4" />
            重新发送 OTP
          </AppButton>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-3">
          <h2 className="font-display text-[1.9rem] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
            输入验证码
          </h2>
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            验证码已发送到绑定号码。输入 6 位 OTP 后即可获取上线结果。
          </p>
        </div>

        <FormField label="OTP" hint="原型模式下除 `000000` 外的任意 6 位数字都会返回成功。">
          <div className="flex min-h-14 items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-100 dark:border-white/10 dark:bg-white/5 dark:focus-within:ring-sky-500/15">
            <MessageSquareText className="h-5 w-5 text-slate-400" />
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
              placeholder="请输入 6 位验证码"
              inputMode="numeric"
              autoComplete="one-time-code"
            />
          </div>
        </FormField>

        <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50/80 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-200">校验提示</p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            如果验证码失效，可以直接重新发送。提交成功后会生成可追踪的结果编号。
          </p>
        </div>
      </div>
    </MiniAppShell>
  )
}