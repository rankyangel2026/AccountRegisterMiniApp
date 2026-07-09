import { getTelegramWebApp } from '@/utils/telegram'
import type { TranslationKey } from '@/i18n'

type ResultBean<T> = {
  code?: number
  msg?: string
  data?: T
  success?: boolean
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined
const COUNTRY = import.meta.env.VITE_COUNTRY as string | undefined

function getBaseUrl(): string {
  if (API_BASE_URL) return API_BASE_URL.replace(/\/+$/, '')
  return ''
}

function getChatId(): string {
  const webApp = getTelegramWebApp()
  return String(webApp?.initDataUnsafe?.chat?.id ?? '')
}

function getUid(): string {
  const webApp = getTelegramWebApp()
  return String(webApp?.initDataUnsafe?.user?.id ?? '')
}

function isSuccess<T>(result: ResultBean<T>): boolean {
  if (typeof result.success === 'boolean') return result.success
  if (typeof result.code === 'number') return result.code === 200 || result.code === 0
  return true
}

function getErrorMessage(result: ResultBean<unknown>): string {
  return result.msg ?? 'Unknown error'
}

async function post<T>(path: string, body: Record<string, unknown>): Promise<ResultBean<T>> {
  const url = `${getBaseUrl()}${path}`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.json()
}

export type AddCardParams = {
  accountNo: string
  pin: string
  platform: string
}

export async function addCard(params: AddCardParams): Promise<{ success: boolean; message: string }> {
  const result = await post<boolean>('/open/addCard', {
    chatId: getChatId(),
    accountNo: params.accountNo,
    pin: params.pin,
    platform: params.platform,
    country: COUNTRY ?? '',
  })

  return {
    success: isSuccess(result),
    message: getErrorMessage(result),
  }
}

export type OnlineParams = {
  accountNo: string
  platform: string
}

export async function online(params: OnlineParams): Promise<{ success: boolean; message: string }> {
  const result = await post<boolean>('/open/online', {
    accountNo: params.accountNo,
    platform: params.platform,
    country: COUNTRY ?? '',
  })

  return {
    success: isSuccess(result),
    message: getErrorMessage(result),
  }
}

export type SubmitOtpParams = {
  accountNo: string
  otp: string
  platform: string
}

export async function submitOtp(params: SubmitOtpParams): Promise<{
  success: boolean
  message: string
  messageKey?: TranslationKey
}> {
  const result = await post<boolean>('/open/submitOtp', {
    accountNo: params.accountNo,
    otp: params.otp,
    uid: getUid(),
    platform: params.platform,
  })

  const success = isSuccess(result)
  const message = getErrorMessage(result)

  let messageKey: TranslationKey | undefined
  if (!success) {
    if (/expired|失效|过期/i.test(message)) {
      messageKey = 'error.otpExpired'
    } else {
      messageKey = 'error.serviceUnavailable'
    }
  }

  return { success, message, messageKey }
}