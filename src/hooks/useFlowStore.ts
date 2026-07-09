import { create } from 'zustand'
import { submitAccount, verifyOtp } from '@/utils/mockApi'

const STORAGE_KEY = 'tg-miniapp-direct-v2'

type ResultStatus = 'idle' | 'success' | 'error'

type PersistedDraft = {
  account: string
  otp: string
  sessionId: string
  resultStatus: ResultStatus
  resultRef: string
  errorMessage: string
}

type FlowStore = PersistedDraft & {
  pin: string
  pinVisible: boolean
  submittingStep: 'account' | 'otp' | null
  toast: string
  hydrateDraft: () => void
  setAccount: (value: string) => void
  setPin: (value: string) => void
  setOtp: (value: string) => void
  togglePinVisibility: () => void
  clearToast: () => void
  submitAccountStep: () => Promise<boolean>
  verifyOtpStep: () => Promise<boolean>
  resetFlow: () => void
}

const persistedDefaults: PersistedDraft = {
  account: '',
  otp: '',
  sessionId: '',
  resultStatus: 'idle',
  resultRef: '',
  errorMessage: '',
}

const defaultState: Omit<FlowStore, keyof PersistedDraft> = {
  pin: '',
  pinVisible: false,
  submittingStep: null,
  toast: '',
  hydrateDraft: () => undefined,
  setAccount: () => undefined,
  setPin: () => undefined,
  setOtp: () => undefined,
  togglePinVisibility: () => undefined,
  clearToast: () => undefined,
  submitAccountStep: async () => false,
  verifyOtpStep: async () => false,
  resetFlow: () => undefined,
}

function readDraft(): PersistedDraft {
  if (typeof window === 'undefined') {
    return persistedDefaults
  }

  try {
    const rawDraft = window.localStorage.getItem(STORAGE_KEY)

    if (!rawDraft) {
      return persistedDefaults
    }

    return { ...persistedDefaults, ...JSON.parse(rawDraft) }
  } catch {
    return persistedDefaults
  }
}

function writeDraft(state: FlowStore) {
  if (typeof window === 'undefined') {
    return
  }

  const draft: PersistedDraft = {
    account: state.account,
    otp: state.otp,
    sessionId: state.sessionId,
    resultStatus: state.resultStatus,
    resultRef: state.resultRef,
    errorMessage: state.errorMessage,
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  ...persistedDefaults,
  ...defaultState,
  hydrateDraft: () => {
    set(readDraft())
  },
  setAccount: (value) => {
    set((state) => ({ account: value.trimStart(), resultStatus: state.resultStatus === 'idle' ? state.resultStatus : 'idle' }))
    writeDraft(get())
  },
  setPin: (value) => {
    set({ pin: value.replace(/\D/g, '').slice(0, 8) })
  },
  setOtp: (value) => {
    set({ otp: value.replace(/\D/g, '').slice(0, 6) })
    writeDraft(get())
  },
  togglePinVisibility: () => {
    set((state) => ({ pinVisible: !state.pinVisible }))
  },
  clearToast: () => set({ toast: '' }),
  submitAccountStep: async () => {
    const { account, pin } = get()

    if (account.trim().length < 3 || pin.length < 4) {
      set({ toast: '请填写账号并输入至少 4 位 PIN。' })
      return false
    }

    set({ submittingStep: 'account', toast: '' })

    try {
      const response = await submitAccount({ account: account.trim(), pin })

      set({
        sessionId: response.sessionId,
        otp: '',
        submittingStep: null,
        resultStatus: 'idle',
        resultRef: '',
        errorMessage: '',
        toast: 'OTP 已发送，当前链路为账号直连模式。',
      })

      writeDraft(get())
      return true
    } catch {
      set({
        submittingStep: null,
        resultStatus: 'error',
        errorMessage: '账号提交失败，请稍后重试。',
        toast: '账号提交失败，请稍后重试。',
      })
      writeDraft(get())
      return false
    }
  },
  verifyOtpStep: async () => {
    const { otp, sessionId } = get()

    if (!/^\d{6}$/.test(otp)) {
      set({ toast: '请输入 6 位 OTP。' })
      return false
    }

    set({ submittingStep: 'otp', toast: '' })

    try {
      const response = await verifyOtp({ sessionId, otp })

      set({
        submittingStep: null,
        resultStatus: response.success ? 'success' : 'error',
        resultRef: response.resultRef,
        errorMessage: response.message ?? '',
        toast: response.success ? '上线结果已返回。' : 'OTP 校验失败，请重新确认。',
      })

      writeDraft(get())
      return response.success
    } catch {
      set({
        submittingStep: null,
        resultStatus: 'error',
        errorMessage: '服务暂时不可用，请稍后重试。',
        toast: '服务暂时不可用，请稍后重试。',
      })
      writeDraft(get())
      return false
    }
  },
  resetFlow: () => {
    set({
      ...persistedDefaults,
      pin: '',
      pinVisible: false,
      submittingStep: null,
      toast: '流程已重置，可以重新发起上线。',
    })
    writeDraft(get())
  },
}))
