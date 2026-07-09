import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '@/App'
import { useFlowStore } from '@/hooks/useFlowStore'

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
    useFlowStore.getState().resetFlow()
    useFlowStore.setState({ toast: '' })
  })

  it('renders the welcome page', () => {
    renderApp()

    expect(screen.getByText('手机卡上线申请')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /开始上线/i })[0]).toBeTruthy()
  })

  it('completes the direct onboarding flow', async () => {
    renderApp()

    fireEvent.click(screen.getAllByRole('button', { name: /开始上线/i })[0])

    expect(await screen.findByText('提交账号与 PIN')).toBeTruthy()

    fireEvent.change(screen.getByPlaceholderText('请输入上线账号'), {
      target: { value: 'demo-account' },
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
      target: { value: 'demo-account' },
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
})
