import { useState } from 'react'
import { getTelegramWebApp } from '@/utils/telegram'

export function DebugBar() {
  const [collapsed, setCollapsed] = useState(true)
  const webApp = getTelegramWebApp()
  const initData = webApp?.initData

  if (!import.meta.env.DEV) {
    return null
  }

  const chat = webApp?.initDataUnsafe?.chat
  const user = webApp?.initDataUnsafe?.user

  const handleCopy = () => {
    if (!initData) {
      return
    }

    navigator.clipboard.writeText(initData)
  }

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-sky-300 bg-sky-50 text-xs shadow-lg dark:border-sky-700 dark:bg-sky-950">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex max-w-full items-center justify-between gap-2 px-3 py-1.5 text-sky-700 dark:text-sky-300"
      >
        <span className="truncate font-semibold">
          Debug: {initData ? 'initData ready' : 'No initData'} {chat ? `| chatId=${chat.id}` : ''} {user ? `| uid=${user.id}` : ''}
        </span>
        <span>{collapsed ? '▲' : '▼'}</span>
      </button>
      {!collapsed && (
        <div className="max-h-40 w-[min(28rem,calc(100vw-1.5rem))] overflow-auto border-t border-sky-200 px-3 py-2 dark:border-sky-800">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-semibold text-sky-700 dark:text-sky-300">initData:</span>
            <button
              onClick={handleCopy}
              disabled={!initData}
              className="rounded bg-sky-200 px-2 py-0.5 text-sky-800 hover:bg-sky-300 dark:bg-sky-800 dark:text-sky-200"
            >
              复制
            </button>
          </div>
          <pre className="whitespace-pre-wrap break-all text-slate-600 dark:text-slate-400">
            {initData || 'Open this app inside Telegram Mini App to receive initData.'}
          </pre>
        </div>
      )}
    </div>
  )
}
