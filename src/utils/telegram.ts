import { translate } from '@/i18n'

export type TelegramTheme = 'light' | 'dark'

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
type NotificationType = 'success' | 'warning' | 'error'

type TelegramUser = {
  id?: number
  first_name?: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

type ThemeParams = {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

type PopupButton = {
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

type PopupParams = {
  title?: string
  message: string
  buttons?: PopupButton[]
}

type MainButton = {
  text?: string
  color?: string
  textColor?: string
  isVisible?: boolean
  isActive?: boolean
  isProgressVisible?: boolean
  setText: (text: string) => MainButton
  setTextColor: (color: string) => MainButton
  setColor: (color: string) => MainButton
  show: () => MainButton
  hide: () => MainButton
  enable: () => MainButton
  disable: () => MainButton
  showProgress: (leaveActive?: boolean) => MainButton
  hideProgress: () => MainButton
  onClick: (fn: () => void) => MainButton
  offClick: (fn: () => void) => MainButton
}

type BackButton = {
  isVisible?: boolean
  show: () => BackButton
  hide: () => BackButton
  onClick: (fn: () => void) => BackButton
  offClick: (fn: () => void) => BackButton
}

type SecureStorage = {
  setItem: (key: string, value: string, callback?: (error?: Error) => void) => void
  getItem: (key: string, callback: (error?: Error, value?: string) => void) => void
  removeItem: (key: string, callback?: (error?: Error) => void) => void
}

type TelegramWebApp = {
  ready: () => void
  expand: () => void
  close: () => void

  colorScheme?: TelegramTheme
  themeParams?: ThemeParams
  isExpanded?: boolean
  viewportHeight?: number
  viewportStableHeight?: number
  headerColor?: string
  backgroundColor?: string
  isClosingConfirmationEnabled?: boolean

  version?: string
  platform?: string
  initData?: string
  initDataUnsafe?: {
    user?: TelegramUser
    chat?: {
      id?: number
      type?: string
      title?: string
      username?: string
      first_name?: string
      last_name?: string
    }
    start_param?: string
    auth_date?: number
    hash?: string
  }

  MainButton?: MainButton
  BackButton?: BackButton
  SecureStorage?: SecureStorage

  HapticFeedback?: {
    impactOccurred: (style: ImpactStyle) => void
    notificationOccurred: (type: NotificationType) => void
    selectionChanged: () => void
  }

  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void

  showPopup: (params: PopupParams, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (ok: boolean) => void) => void

  openTelegramLink: (url: string) => void
  openInvoice: (url: string, callback?: (status: string) => void) => void
  readTextFromClipboard: (callback: (text: string | null) => void) => void
  requestWriteAccess: (callback?: (granted: boolean) => void) => void
  requestContact: (callback?: (shared: boolean) => void) => void

  onEvent: (event: TelegramEventType, handler: (...args: unknown[]) => void) => void
  offEvent: (event: TelegramEventType, handler: (...args: unknown[]) => void) => void
}

type TelegramEventType =
  | 'themeChanged'
  | 'viewportChanged'
  | 'mainButtonClicked'
  | 'backButtonClicked'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

export type { TelegramUser, ThemeParams, MainButton, BackButton, PopupParams, PopupButton }

export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') {
    return null
  }

  return window.Telegram?.WebApp ?? null
}

export function initTelegramMiniApp(): {
  isTelegram: boolean
  theme: TelegramTheme
  displayName: string
  themeParams: ThemeParams
  version: string
  platform: string
} {
  const webApp = getTelegramWebApp()
  const user = webApp?.initDataUnsafe?.user
  const theme = webApp?.colorScheme === 'dark' ? 'dark' : 'light'

  if (webApp) {
    webApp.ready()
    webApp.expand()
  }

  return {
    isTelegram: Boolean(webApp),
    theme,
    displayName: user?.first_name || user?.username || translate('telegram.defaultUser'),
    themeParams: webApp?.themeParams ?? {},
    version: webApp?.version ?? '6.0',
    platform: webApp?.platform ?? 'unknown',
  }
}

export function closeTelegramMiniApp() {
  const webApp = getTelegramWebApp()

  if (webApp) {
    webApp.close()
    return true
  }

  return false
}

export function enableClosingConfirmation() {
  const webApp = getTelegramWebApp()
  webApp?.enableClosingConfirmation()
}

export function disableClosingConfirmation() {
  const webApp = getTelegramWebApp()
  webApp?.disableClosingConfirmation()
}

export type HapticType = ImpactStyle | NotificationType | 'selection'

export function triggerHaptic(type: HapticType) {
  const webApp = getTelegramWebApp()

  if (!webApp?.HapticFeedback) {
    return
  }

  if (type === 'selection') {
    webApp.HapticFeedback.selectionChanged()
    return
  }

  if (type === 'light' || type === 'medium' || type === 'heavy' || type === 'rigid' || type === 'soft') {
    webApp.HapticFeedback.impactOccurred(type)
    return
  }

  webApp.HapticFeedback.notificationOccurred(type)
}

export function showAlert(message: string, callback?: () => void) {
  const webApp = getTelegramWebApp()

  if (webApp) {
    webApp.showAlert(message, callback)
    return
  }

  window.alert(message)
  callback?.()
}

export function showConfirm(message: string, callback?: (ok: boolean) => void) {
  const webApp = getTelegramWebApp()

  if (webApp) {
    webApp.showConfirm(message, callback)
    return
  }

  const ok = window.confirm(message)
  callback?.(ok)
}

export function showPopup(params: PopupParams, callback?: (buttonId: string) => void) {
  const webApp = getTelegramWebApp()

  if (webApp) {
    webApp.showPopup(params, callback)
    return
  }

  window.alert(params.message)
  callback?.('ok')
}

export function openTelegramLink(url: string) {
  const webApp = getTelegramWebApp()

  if (webApp) {
    webApp.openTelegramLink(url)
    return
  }

  window.open(url, '_blank', 'noopener')
}

export function onTelegramEvent(event: TelegramEventType, handler: (...args: unknown[]) => void) {
  const webApp = getTelegramWebApp()
  webApp?.onEvent(event, handler)
}

export function offTelegramEvent(event: TelegramEventType, handler: (...args: unknown[]) => void) {
  const webApp = getTelegramWebApp()
  webApp?.offEvent(event, handler)
}

export function getMainButton(): MainButton | null {
  return getTelegramWebApp()?.MainButton ?? null
}

export function getBackButton(): BackButton | null {
  return getTelegramWebApp()?.BackButton ?? null
}

function hasSecureStorage(): boolean {
  const webApp = getTelegramWebApp()
  return Boolean(webApp?.SecureStorage)
}

export function isSecureStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  return hasSecureStorage()
}

export async function secureGetItem(key: string): Promise<string | null> {
  if (!hasSecureStorage()) {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }

  return new Promise((resolve) => {
    getTelegramWebApp()!.SecureStorage!.getItem(key, (error, value) => {
      if (error) {
        resolve(null)
        return
      }
      resolve(value ?? null)
    })
  })
}

export async function secureSetItem(key: string, value: string): Promise<void> {
  if (!hasSecureStorage()) {
    window.localStorage.setItem(key, value)
    return
  }

  return new Promise((resolve, reject) => {
    getTelegramWebApp()!.SecureStorage!.setItem(key, value, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

export async function secureRemoveItem(key: string): Promise<void> {
  if (!hasSecureStorage()) {
    window.localStorage.removeItem(key)
    return
  }

  return new Promise((resolve, reject) => {
    getTelegramWebApp()!.SecureStorage!.removeItem(key, (error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}

type AccessCheckResult = {
  allowed: boolean
  reason: 'not_telegram' | 'no_chat' | 'chat_denied' | 'backend_denied' | 'backend_error' | 'ok'
  chatId?: number
  chatTitle?: string
}

const ALLOWED_CHAT_IDS_ENV = import.meta.env.VITE_ALLOWED_CHAT_IDS as string | undefined

function parseAllowedChatIds(): number[] {
  if (!ALLOWED_CHAT_IDS_ENV) return []
  return ALLOWED_CHAT_IDS_ENV
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number)
    .filter((n) => !isNaN(n))
}

export function checkFrontendAccess(): AccessCheckResult {
  const webApp = getTelegramWebApp()

  if (!webApp) {
    return { allowed: false, reason: 'not_telegram' }
  }

  const chat = webApp.initDataUnsafe?.chat
  if (!chat || chat.id == null) {
    return { allowed: false, reason: 'no_chat' }
  }

  const allowedIds = parseAllowedChatIds()
  if (allowedIds.length === 0) {
    return { allowed: true, reason: 'ok', chatId: chat.id, chatTitle: chat.title }
  }

  if (allowedIds.includes(chat.id)) {
    return { allowed: true, reason: 'ok', chatId: chat.id, chatTitle: chat.title }
  }

  return { allowed: false, reason: 'chat_denied', chatId: chat.id, chatTitle: chat.title }
}

export async function checkBackendAccess(): Promise<AccessCheckResult> {
  const webApp = getTelegramWebApp()
  const initData = webApp?.initData

  if (!webApp || !initData) {
    return { allowed: false, reason: 'not_telegram' }
  }

  try {
    const response = await fetch('/api/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initData }),
    })

    const data = await response.json()

    if (!data.valid) {
      return { allowed: false, reason: 'backend_denied' }
    }

    if (!data.allowed) {
      return { allowed: false, reason: 'backend_denied', chatId: data.chatId, chatTitle: data.chatTitle }
    }

    return { allowed: true, reason: 'ok', chatId: data.chatId, chatTitle: data.chatTitle }
  } catch {
    return { allowed: false, reason: 'backend_error' }
  }
}