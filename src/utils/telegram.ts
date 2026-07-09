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
    displayName: user?.first_name || user?.username || 'Telegram 用户',
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