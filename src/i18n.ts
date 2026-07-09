import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'tg-miniapp-locale'

const zhCN = {
  'app.documentTitle': '手机卡直连上线',
  'common.backAria': '返回上一步',
  'common.languageToggleAria': '切换语言',
  'common.languageSwitchText': 'EN',
  'telegram.defaultUser': 'Telegram 用户',
  'telegram.guest': '访客',

  'welcome.title': '上线流程',
  'welcome.label': '3 steps',
  'welcome.heading': '手机卡上线申请',
  'welcome.description': '按以下流程完成账号提交、OTP 校验和结果确认。',
  'welcome.start': '开始上线',
  'welcome.stepAccountTitle': '提交账号与 PIN',
  'welcome.stepAccountDescription': '输入上线账号和 PIN，提交后创建本次上线会话。',
  'welcome.stepOtpTitle': '输入 OTP',
  'welcome.stepOtpDescription': '收到验证码后填写 6 位 OTP，提交校验。',
  'welcome.stepResultTitle': '查看上线结果',
  'welcome.stepResultDescription': '校验完成后显示上线状态和结果编号。',

  'submit.mainButton': '提交账号信息',
  'submit.title': '提交账号信息',
  'submit.label': 'Step 1',
  'submit.heading': '提交账号与 PIN',
  'submit.description': '请选择渠道、输入上线账号与 PIN。账号会自动保存；出于安全考虑，PIN 在刷新后需要重新输入。',
  'submit.channelLabel': '渠道',
  'submit.channelPlaceholder': '请选择渠道',
  'submit.accountLabel': '上线账号',
  'submit.accountHint': '仅支持 11 位数字，例如 01234567890。',
  'submit.accountPlaceholder': '请输入上线账号',
  'submit.pinLabel': 'PIN',
  'submit.pinHint': '仅允许数字输入，至少 4 位，最多 6 位。',
  'submit.pinPlaceholder': '请输入 PIN',
  'submit.togglePinAria': '切换 PIN 可见性',

  'otp.mainButton': '提交 OTP',
  'otp.title': 'OTP 校验',
  'otp.label': 'Step 2',
  'otp.resend': '重新发送 OTP',
  'otp.heading': '输入验证码',
  'otp.description': '验证码已发送到绑定号码。输入 6 位 OTP 后即可获取上线结果。',
  'otp.hint': '原型模式下除 `000000` 外的任意 6 位数字都会返回成功。',
  'otp.placeholder': '请输入 6 位验证码',
  'otp.tipTitle': '校验提示',
  'otp.tipBody': '如果验证码失效，可以直接重新发送。提交成功后会生成可追踪的结果编号。',

  'result.title': '上线结果',
  'result.label': '完成',
  'result.close': '关闭 Mini App',
  'result.restart': '重新上线',
  'result.retryOtp': '返回 OTP 重试',
  'result.successTitle': '上线成功',
  'result.errorTitle': '上线失败',
  'result.successBody': '账号已经成功上线，可以返回 Telegram 继续后续操作。',
  'result.errorFallback': '校验未通过，请重新确认 OTP 或重新发起流程。',
  'result.refLabel': '结果编号',
  'result.pendingRef': '等待生成',
  'result.confirmClose': '确定要关闭 Mini App 吗？',

  'toast.invalidAccountPin': '请输入 11 位数字账号，并输入 4 到 6 位数字 PIN。',
  'toast.otpSent': 'OTP 已发送，当前链路为账号直连模式。',
  'toast.submitFailed': '账号提交失败，请稍后重试。',
  'toast.invalidOtp': '请输入 6 位 OTP。',
  'toast.otpSuccess': '上线结果已返回。',
  'toast.otpFailed': 'OTP 校验失败，请重新确认。',
  'toast.serviceUnavailable': '服务暂时不可用，请稍后重试。',
  'toast.flowReset': '流程已重置，可以重新发起上线。',
  'toast.otpResent': 'OTP 已重新发送，请留意短信。',
  'toast.browserCannotClose': '当前为浏览器预览模式，无法真正关闭 Telegram Mini App。',

  'error.otpExpired': '验证码已失效，请重新发送后再试。',
  'error.submitFailed': '账号提交失败，请稍后重试。',
  'error.serviceUnavailable': '服务暂时不可用，请稍后重试。',

  'access.deniedTitle': '访问受限',
  'access.denied': '您没有权限使用此应用。',
  'access.notTelegram': '此应用仅限 Telegram 内使用，请在 Telegram 中打开。',
  'access.noChat': '此应用仅限指定群组内使用，请从群聊中打开。',
  'access.chatDenied': '当前群组未获得授权，请联系管理员。',
  'access.backendError': '访问验证服务异常，请稍后重试。',
} as const

const enUS = {
  'app.documentTitle': 'SIM Card Direct Activation',
  'common.backAria': 'Go back',
  'common.languageToggleAria': 'Switch language',
  'common.languageSwitchText': '中文',
  'telegram.defaultUser': 'Telegram user',
  'telegram.guest': 'Guest',

  'welcome.title': 'Activation Flow',
  'welcome.label': '3 steps',
  'welcome.heading': 'SIM card activation',
  'welcome.description': 'Follow these steps to submit the account, verify OTP, and confirm the result.',
  'welcome.start': 'Start activation',
  'welcome.stepAccountTitle': 'Submit account and PIN',
  'welcome.stepAccountDescription': 'Enter the activation account and PIN to create this activation session.',
  'welcome.stepOtpTitle': 'Enter OTP',
  'welcome.stepOtpDescription': 'Fill in the 6-digit OTP after you receive it, then submit for verification.',
  'welcome.stepResultTitle': 'Check the result',
  'welcome.stepResultDescription': 'After verification, view the activation status and result reference.',

  'submit.mainButton': 'Submit account',
  'submit.title': 'Submit account',
  'submit.label': 'Step 1',
  'submit.heading': 'Submit account and PIN',
  'submit.description': 'Select a channel, enter the activation account and PIN. The account is saved automatically; the PIN must be re-entered after refresh.',
  'submit.channelLabel': 'Channel',
  'submit.channelPlaceholder': 'Select a channel',
  'submit.accountLabel': 'Activation account',
  'submit.accountHint': 'Only 11 digits are supported, for example 01234567890.',
  'submit.accountPlaceholder': 'Enter activation account',
  'submit.pinLabel': 'PIN',
  'submit.pinHint': 'Numbers only. Minimum 4 digits, maximum 6 digits.',
  'submit.pinPlaceholder': 'Enter PIN',
  'submit.togglePinAria': 'Toggle PIN visibility',

  'otp.mainButton': 'Submit OTP',
  'otp.title': 'OTP verification',
  'otp.label': 'Step 2',
  'otp.resend': 'Resend OTP',
  'otp.heading': 'Enter verification code',
  'otp.description': 'The code has been sent to the linked number. Enter the 6-digit OTP to get the activation result.',
  'otp.hint': 'In prototype mode, any 6-digit code except `000000` returns success.',
  'otp.placeholder': 'Enter 6-digit code',
  'otp.tipTitle': 'Verification note',
  'otp.tipBody': 'If the code expires, resend it directly. A traceable result reference is generated after success.',

  'result.title': 'Activation result',
  'result.label': 'Done',
  'result.close': 'Close Mini App',
  'result.restart': 'Start over',
  'result.retryOtp': 'Retry OTP',
  'result.successTitle': 'Activation successful',
  'result.errorTitle': 'Activation failed',
  'result.successBody': 'The account has been activated. You can return to Telegram for the next step.',
  'result.errorFallback': 'Verification failed. Please check the OTP or restart the flow.',
  'result.refLabel': 'Result reference',
  'result.pendingRef': 'Pending',
  'result.confirmClose': 'Close this Mini App?',

  'toast.invalidAccountPin': 'Enter an 11-digit account and a 4 to 6-digit PIN.',
  'toast.otpSent': 'OTP sent. Current flow is account direct activation.',
  'toast.submitFailed': 'Account submission failed. Please try again later.',
  'toast.invalidOtp': 'Enter a 6-digit OTP.',
  'toast.otpSuccess': 'Activation result returned.',
  'toast.otpFailed': 'OTP verification failed. Please check again.',
  'toast.serviceUnavailable': 'Service is temporarily unavailable. Please try again later.',
  'toast.flowReset': 'Flow reset. You can start activation again.',
  'toast.otpResent': 'OTP resent. Please check your messages.',
  'toast.browserCannotClose': 'Browser preview mode cannot close the Telegram Mini App.',

  'error.otpExpired': 'The code has expired. Please resend it and try again.',
  'error.submitFailed': 'Account submission failed. Please try again later.',
  'error.serviceUnavailable': 'Service is temporarily unavailable. Please try again later.',

  'access.deniedTitle': 'Access Restricted',
  'access.denied': 'You do not have permission to use this app.',
  'access.notTelegram': 'This app is only available in Telegram. Please open it in Telegram.',
  'access.noChat': 'This app is only available in designated groups. Please open it from a group chat.',
  'access.chatDenied': 'This group is not authorized. Please contact the administrator.',
  'access.backendError': 'Access verification service error. Please try again later.',
} satisfies Record<keyof typeof zhCN, string>

export const translations = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

export type Locale = keyof typeof translations
export type TranslationKey = keyof typeof zhCN

const listeners = new Set<() => void>()

function normalizeLocale(value?: string | null): Locale {
  return value?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') {
    return 'zh-CN'
  }

  const savedLocale = window.localStorage.getItem(STORAGE_KEY)
  if (savedLocale === 'zh-CN' || savedLocale === 'en-US') {
    return savedLocale
  }

  const telegramWindow = window as Window & {
    Telegram?: {
      WebApp?: {
        initDataUnsafe?: {
          user?: {
            language_code?: string
          }
        }
      }
    }
  }
  const telegramLanguage = telegramWindow.Telegram?.WebApp?.initDataUnsafe?.user?.language_code
  return normalizeLocale(telegramLanguage ?? window.navigator.language)
}

let currentLocale: Locale = detectInitialLocale()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return currentLocale
}

export function getLocale() {
  return currentLocale
}

export function setLocale(locale: Locale) {
  if (currentLocale === locale) {
    return
  }

  currentLocale = locale

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, locale)
  }

  emitChange()
}

export function translate(key: TranslationKey, locale: Locale = currentLocale) {
  return translations[locale][key]
}

export function useI18n() {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  return {
    locale,
    setLocale,
    toggleLocale: () => setLocale(locale === 'zh-CN' ? 'en-US' : 'zh-CN'),
    t: (key: TranslationKey) => translate(key, locale),
  }
}