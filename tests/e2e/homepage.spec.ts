import { test, expect } from '@playwright/test'

test('homepage loads and displays correctly', async ({ page }) => {
  await page.goto('/')

  // Check that the main heading is visible
  await expect(page.getByText('Dallas Muslim Flag Football League')).toBeVisible()

  // Check for season badge
  await expect(page.getByText('Season 4')).toBeVisible()

  // Check navigation links are present
  await expect(page.getByRole('link', { name: 'Teams' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Players' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Schedule' })).toBeVisible()

  // Check that the page is responsive
  await page.setViewportSize({ width: 375, height: 667 }) // Mobile size
  await expect(page.getByText('Dallas Muslim Flag Football League')).toBeVisible()
})

test('navigation works correctly', async ({ page }) => {
  await page.goto('/')

  // Navigate to teams page
  await page.getByRole('link', { name: 'Teams' }).click()
  await expect(page.getByText('Teams')).toBeVisible()

  // Navigate to players page
  await page.getByRole('link', { name: 'Players' }).click()
  await expect(page.getByText('Players')).toBeVisible()

  // Navigate to schedule page
  await page.getByRole('link', { name: 'Schedule' }).click()
  await expect(page.getByText('Schedule & Results')).toBeVisible()
})