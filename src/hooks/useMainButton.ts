import { useCallback, useEffect, useRef } from 'react'
import { getMainButton } from '@/utils/telegram'

type UseMainButtonOptions = {
  text?: string
  visible?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export function useMainButton({ text, visible, disabled, loading, onClick }: UseMainButtonOptions) {
  const onClickRef = useRef(onClick)
  onClickRef.current = onClick

  const stableOnClick = useCallback(() => {
    onClickRef.current?.()
  }, [])

  useEffect(() => {
    const mainButton = getMainButton()
    if (!mainButton) {
      return
    }

    if (text !== undefined) {
      mainButton.setText(text)
    }

    if (visible) {
      mainButton.show()
    } else {
      mainButton.hide()
    }

    if (disabled) {
      mainButton.disable()
    } else {
      mainButton.enable()
    }

    if (loading) {
      mainButton.showProgress()
    } else {
      mainButton.hideProgress()
    }

    if (onClick) {
      mainButton.onClick(stableOnClick)
    }

    return () => {
      mainButton.offClick(stableOnClick)
      mainButton.hide()
      mainButton.hideProgress()
      mainButton.enable()
    }
  }, [text, visible, disabled, loading, onClick, stableOnClick])
}