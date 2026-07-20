import { expect, test } from '@playwright/test'

test('registers, edits a profile, follows, and receives a notification', async ({ browser }) => {
  test.skip(process.env.RUN_FOUR_SERVICE_E2E !== '1', 'Set RUN_FOUR_SERVICE_E2E=1 with the backend stack running')
  const suffix = Date.now().toString()
  const usernameA = `browser_a_${suffix}`
  const usernameB = `browser_b_${suffix}`
  const contextA = await browser.newContext()
  const contextB = await browser.newContext()
  const pageA = await contextA.newPage()
  const pageB = await contextB.newPage()

  await register(pageA, usernameA)
  await register(pageB, usernameB)

  await pageA.goto(`/profile/${usernameB}`)
  await pageA.getByRole('button', { name: 'دنبال کنید' }).click()
  await expect(pageA.getByRole('button', { name: 'لغو دنبال‌کردن' })).toBeVisible()

  await pageB.goto('/notifications')
  await expect(pageB.getByText('شما را دنبال کرد')).toBeVisible({ timeout: 15_000 })
  await pageB.getByRole('button', { name: /شما را دنبال کرد/ }).click()
  await pageB.getByRole('button', { name: 'خواندن همه' }).click()

  const renamed = `renamed_${suffix}`
  await pageA.goto('/profile/edit')
  await pageA.getByPlaceholder('username').fill(renamed)
  await pageA.getByRole('button', { name: 'ذخیره تغییرات' }).click()
  await expect(pageA).toHaveURL(new RegExp(`/profile/${renamed}$`))

  await contextA.close()
  await contextB.close()
})

async function register(page: import('@playwright/test').Page, username: string) {
  await page.goto('/register')
  await page.getByPlaceholder('ایمیل').fill(`${username}@example.com`)
  await page.getByPlaceholder('نام کاربری').fill(username)
  await page.getByPlaceholder('رمز عبور').fill('password123')
  await page.getByPlaceholder('تکرار رمز عبور').fill('password123')
  await page.getByRole('button', { name: 'ثبت نام', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(`/profile/${username}$`), { timeout: 20_000 })
}
