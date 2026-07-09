import { create } from 'zustand'
import { submitAccount, verifyOtp } from '@/utils/mockApi'
import { secureGetItem, secureSetItem, secureRemoveItem } from '@/utils/telegram'
import { translate, type TranslationKey } from '@/i18n'

const STORAGE_KEY = 'tg-miniapp-direct-v2'
export const ACCOUNT_PATTERN = /^\d{11}$/
export const PIN_PATTERN = /^\d{4,6}$/

type ResultStatus = 'idle' | 'success' | 'error'

type PersistedDraft = {
  account: string
  otp: string
  sessionId: string
  resultStatus: ResultStatus
  resultRef: string
  errorMessage: string
  errorMessageKey: TranslationKey | ''
}

type FlowStore = PersistedDraft & {
  pin: string
  pinVisible: boolean
  submittingStep: 'account' | 'otp' | null
  toast: string
  hydrated: boolean
  hydrateDraft: () => Promise<void>
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
  errorMessageKey: '',
}

const defaultState: Omit<FlowStore, keyof PersistedDraft> = {
  pin: '',
  pinVisible: false,
  submittingStep: null,
  toast: '',
  hydrated: false,
  hydrateDraft: async () => undefined,
  setAccount: () => undefined,
  setPin: () => undefined,
  setOtp: () => undefined,
  togglePinVisibility: () => undefined,
  clearToast: () => undefined,
  submitAccountStep: async () => false,
  verifyOtpStep: async () => false,
  resetFlow: () => undefined,
}

async function readDraft(): Promise<PersistedDraft> {
  if (typeof window === 'undefined') {
    return persistedDefaults
  }

  try {
    const rawDraft = await secureGetItem(STORAGE_KEY)

    if (!rawDraft) {
      return persistedDefaults
    }

    return { ...persistedDefaults, ...JSON.parse(rawDraft) }
  } catch {
    return persistedDefaults
  }
}

async function writeDraft(state: FlowStore) {
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
    errorMessageKey: state.errorMessageKey,
  }

  try {
    await secureSetItem(STORAGE_KEY, JSON.stringify(draft))
  } catch {
    // silent fail
  }
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  ...persistedDefaults,
  ...defaultState,
  hydrateDraft: async () => {
    const draft = await readDraft()
    set({ ...draft, hydrated: true })
  },
  setAccount: (value) => {
    set((state) => ({
      account: value.replace(/\D/g, '').slice(0, 11),
      resultStatus: state.resultStatus === 'idle' ? state.resultStatus : 'idle',
      errorMessage: state.resultStatus === 'idle' ? state.errorMessage : '',
      errorMessageKey: state.resultStatus === 'idle' ? state.errorMessageKey : '',
    }))
    writeDraft(get())
  },
  setPin: (value) => {
    set({ pin: value.replace(/\D/g, '').slice(0, 6) })
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

    if (!ACCOUNT_PATTERN.test(account) || !PIN_PATTERN.test(pin)) {
      set({ toast: translate('toast.invalidAccountPin') })
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
        errorMessageKey: '',
        toast: translate('toast.otpSent'),
      })

      writeDraft(get())
      return true
    } catch {
      set({
        submittingStep: null,
        resultStatus: 'error',
        errorMessage: translate('error.submitFailed'),
        errorMessageKey: 'error.submitFailed',
        toast: translate('toast.submitFailed'),
      })
      writeDraft(get())
      return false
    }
  },
  verifyOtpStep: async () => {
    const { otp, sessionId } = get()

    if (!/^\d{6}$/.test(otp)) {
      set({ toast: translate('toast.invalidOtp') })
      return false
    }

    set({ submittingStep: 'otp', toast: '' })

    try {
      const response = await verifyOtp({ sessionId, otp })

      set({
        submittingStep: null,
        resultStatus: response.success ? 'success' : 'error',
        resultRef: response.resultRef,
        errorMessage: response.messageKey ? translate(response.messageKey) : '',
        errorMessageKey: response.messageKey ?? '',
        toast: response.success ? translate('toast.otpSuccess') : translate('toast.otpFailed'),
      })

      writeDraft(get())
      return response.success
    } catch {
      set({
        submittingStep: null,
        resultStatus: 'error',
        errorMessage: translate('error.serviceUnavailable'),
        errorMessageKey: 'error.serviceUnavailable',
        toast: translate('toast.serviceUnavailable'),
      })
      writeDraft(get())
      return false
    }
  },
  resetFlow: async () => {
    set({
      ...persistedDefaults,
      pin: '',
      pinVisible: false,
      submittingStep: null,
      toast: translate('toast.flowReset'),
    })

    try {
      await secureRemoveItem(STORAGE_KEY)
    } catch {
      // silent fail
    }
  },
}))
