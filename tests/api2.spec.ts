import { expect } from '@playwright/test';
import { test } from '../test-options'
import tags from '../test-data/tags.json'

test.describe.configure({mode: 'parallel'})

test.beforeEach(async({page}) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = "This is Mock test title"
    responseBody.articles[0].description = "This is Mock test description"
    await route.fulfill({
      body: JSON.stringify(responseBody)
    })
  })
  await page.goto("/")
})

test('verify mocked data1', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is Mock test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is Mock test description');
});

test('verify mocked data2', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText('conduit');
  await expect(page.locator('app-article-list h1').first()).toContainText('This is Mock test title');
  await expect(page.locator('app-article-list p').first()).toContainText('This is Mock test description');
});