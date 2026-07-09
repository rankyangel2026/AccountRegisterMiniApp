import { ArrowRight, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AppButton } from '@/components/AppButton'
import { MiniAppShell } from '@/components/MiniAppShell'
import { useMainButton } from '@/hooks/useMainButton'
import { triggerHaptic } from '@/utils/telegram'

export default function WelcomePage() {
  const navigate = useNavigate()

  const handleStart = () => {
    triggerHaptic('light')
    navigate('/submit')
  }

  useMainButton({
    text: '开始上线',
    visible: true,
    onClick: handleStart,
  })

  return (
    <MiniAppShell
      title="欢迎"
      label="准备开始"
      footer={
        <AppButton onClick={handleStart}>
          开始上线
          <ArrowRight className="h-4 w-4" />
        </AppButton>
      }
    >
      <div className="space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-sky-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.35)]">
          <Sparkles className="h-10 w-10" />
        </div>

        <div className="space-y-3">
          <h2 className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.05em] text-slate-950 dark:text-white">
            手机卡上线申请
          </h2>
          <p className="max-w-[20rem] text-sm leading-6 text-slate-600 dark:text-slate-300">
            账号提交后直接进入 OTP 验证，不再依赖扫码动作，适合在 Telegram 对话上下文里快速完成上线。
          </p>
        </div>

        <article className="rounded-[1.75rem] border border-sky-100 bg-white/90 p-5 shadow-sm dark:border-sky-500/20 dark:bg-white/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">账号直连上线</p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">
                提交账号与 PIN 后接收 OTP，校验通过即返回上线结果。
              </p>
            </div>
            <span className="rounded-2xl bg-sky-500 px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white">
              direct
            </span>
          </div>
        </article>

        <div className="grid gap-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">安全处理 PIN</p>
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">PIN 仅保留在当前会话内，不写入本地持久化。</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3">
              <Workflow className="h-5 w-5 text-sky-500" />
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">流程可恢复</p>
                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">账号、OTP 和结果状态可从本地草稿恢复，避免误关丢失进度。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MiniAppShell>
  )
}