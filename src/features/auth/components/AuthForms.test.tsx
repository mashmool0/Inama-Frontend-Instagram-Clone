import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  register: vi.fn(),
  login: vi.fn(),
  registerState: { isPending: false, isError: false, error: null as unknown },
  loginState: { isPending: false, isError: false, error: null as unknown },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => ({ get: () => null }),
}))

vi.mock('../hooks', () => ({
  useRegisterMutation: () => ({ ...mocks.registerState, mutateAsync: mocks.register }),
  useLoginMutation: () => ({ ...mocks.loginState, mutateAsync: mocks.login }),
}))

vi.mock('motion/react', () => ({
  motion: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & Record<string, unknown>>(function MotionElement(
          { children, initial, animate, transition, whileHover, whileTap, ...props },
          ref,
        ) {
          void initial
          void animate
          void transition
          void whileHover
          void whileTap
          return React.createElement(tag, { ...props, ref }, children as React.ReactNode)
        }),
    },
  ),
}))

describe('Auth forms', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.register.mockReset()
    mocks.login.mockReset()
    Object.assign(mocks.registerState, { isPending: false, isError: false, error: null })
    Object.assign(mocks.loginState, { isPending: false, isError: false, error: null })
  })

  it('submits backend registration fields and redirects to the synchronized profile', async () => {
    mocks.register.mockResolvedValue({ profile: { username: 'alice' } })
    render(<RegisterPage />)

    fireEvent.change(screen.getByPlaceholderText('ایمیل'), { target: { value: 'alice@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('نام کاربری'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('رمز عبور'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('تکرار رمز عبور'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: /^ثبت نام$/ }))

    await waitFor(() => {
      expect(mocks.register).toHaveBeenCalledWith({ email: 'alice@example.com', username: 'alice', password: 'password123' })
      expect(mocks.push).toHaveBeenCalledWith('/profile/alice')
    })
  })

  it('blocks registration when password confirmation differs', async () => {
    render(<RegisterPage />)
    fireEvent.change(screen.getByPlaceholderText('ایمیل'), { target: { value: 'alice@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('نام کاربری'), { target: { value: 'alice' } })
    fireEvent.change(screen.getByPlaceholderText('رمز عبور'), { target: { value: 'one' } })
    fireEvent.change(screen.getByPlaceholderText('تکرار رمز عبور'), { target: { value: 'two' } })
    fireEvent.click(screen.getByRole('button', { name: /^ثبت نام$/ }))

    expect(await screen.findByRole('alert')).toHaveTextContent('رمز عبور و تکرار آن یکسان نیستند.')
    expect(mocks.register).not.toHaveBeenCalled()
  })

  it('submits username-or-email login and displays request failures', async () => {
    mocks.login.mockResolvedValue({ profile: { username: 'alice' } })
    const { rerender } = render(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('نام کاربری یا ایمیل'), { target: { value: 'alice@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('رمز عبور'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: 'ورود به حساب' }))
    await waitFor(() => expect(mocks.login).toHaveBeenCalledWith({ identifier: 'alice@example.com', password: 'password123' }))

    Object.assign(mocks.loginState, { isError: true, error: new Error('ورود ناموفق بود.') })
    rerender(<LoginPage />)
    expect(screen.getByRole('alert')).toHaveTextContent('ورود ناموفق بود.')
  })
})
