export type SubmitAccountRequest = {
  account: string
  pin: string
}

export type SubmitAccountResponse = {
  requiresQrScan: false
  flow: 'direct'
  sessionId: string
}

export type VerifyOtpRequest = {
  sessionId: string
  otp: string
}

export type VerifyOtpResponse = {
  success: boolean
  resultRef: string
  message?: string
}

const MOCK_DELAY_MS = 240

function sleep(delay: number) {
  return new Promise((resolve) => window.setTimeout(resolve, delay))
}

export async function submitAccount(payload: SubmitAccountRequest): Promise<SubmitAccountResponse> {
  await sleep(MOCK_DELAY_MS)

  return {
    requiresQrScan: false,
    flow: 'direct',
    sessionId: `sess_${payload.account.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString(36)}`,
  }
}

export async function verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  await sleep(MOCK_DELAY_MS)

  if (payload.otp === '000000') {
    return {
      success: false,
      resultRef: `SIM-${Date.now().toString(36).toUpperCase()}`,
      message: '验证码已失效，请重新发送后再试。',
    }
  }

  return {
    success: true,
    resultRef: `SIM-${Date.now().toString(36).toUpperCase()}`,
  }
}
