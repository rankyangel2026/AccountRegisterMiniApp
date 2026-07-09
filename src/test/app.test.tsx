import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/App'
import { useFlowStore } from '@/hooks/useFlowStore'
import { setLocale } from '@/i18n'

function renderApp(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  )
}

describe('Telegram Mini App flow', () => {
  beforeEach(() => {
    window.localStorage.clear()
    setLocale('zh-CN')
    useFlowStore.getState().resetFlow()
    useFlowStore.setState({ toast: '' })
  })

  it('renders the welcome page', () => {
    renderApp()

    expect(screen.getByText('手机卡上线申请')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /开始上线/i })[0]).toBeTruthy()
  })

  it('switches the welcome page language', () => {
    renderApp()

    fireEvent.click(screen.getByRole('button', { name: '切换语言' }))

    expect(screen.getByText('SIM card activation')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Start activation/i })).toBeTruthy()
  })

  it('completes the direct onboarding flow', async () => {
    renderApp()

    fireEvent.click(screen.getAllByRole('button', { name: /开始上线/i })[0])

    expect(await screen.findByText('提交账号与 PIN')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('请输入上线账号'), {
      target: { value: '01234567890' },
    })
    fireEvent.change(screen.getByPlaceholderText('请输入 PIN'), {
      target: { value: '1234' },
    })
    fireEvent.click(screen.getByRole('button', { name: /提交账号信息/i }))

    expect(await screen.findByText('输入验证码')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('请输入 6 位验证码'), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /提交 OTP/i }))

    expect(await screen.findByText('上线成功')).toBeTruthy()
    expect(screen.getByText(/SIM-/i)).toBeTruthy()
  })

  it('shows an error result when OTP is invalid', async () => {
    renderApp(['/otp'])

    await waitFor(() => {
      expect(screen.getByText('提交账号与 PIN')).toBeTruthy()
    })

    fireEvent.change(screen.getByPlaceholderText('请输入上线账号'), {
      target: { value: '01234567890' },
    })
    fireEvent.change(screen.getByPlaceholderText('请输入 PIN'), {
      target: { value: '1234' },
    })
    fireEvent.click(screen.getByRole('button', { name: /提交账号信息/i }))

    expect(await screen.findByText('输入验证码')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('请输入 6 位验证码'), {
      target: { value: '000000' },
    })
    fireEvent.click(screen.getByRole('button', { name: /提交 OTP/i }))

    expect(await screen.findByText('上线失败')).toBeTruthy()
    expect(screen.getByText('验证码已失效，请重新发送后再试。')).toBeTruthy()
  })

  it('keeps account and PIN inputs numeric with the required limits', async () => {
    renderApp(['/submit'])

    await waitFor(() => {
      expect(screen.getByText('提交账号与 PIN')).toBeTruthy()
    })

    const accountInput = screen.getByPlaceholderText('请输入上线账号') as HTMLInputElement
    const pinInput = screen.getByPlaceholderText('请输入 PIN') as HTMLInputElement

    fireEvent.change(accountInput, {
      target: { value: 'abc01234567890123' },
    })
    fireEvent.change(pinInput, {
      target: { value: '12ab345678' },
    })

    expect(accountInput.value).toBe('01234567890')
    expect(pinInput.value).toBe('123456')
  })
})
