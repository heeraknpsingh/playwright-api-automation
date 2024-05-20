import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker'
import { test } from '../test-options'

const fake_name = faker.music.songName()

test.beforeEach(async({page}) => {
  await page.goto("/")
  await expect(page.locator('app-article-list h1').first()).toContainText('Discover Bondar Academy: Your Gateway to Efficient Learning');
  await expect(page.locator('app-article-list p').first()).toContainText("Discover Bondar Academy's unique place in the educational landscape, where value-focused and efficient learning approaches converge. Our goal is to rapidly enhance your professional technical skills, boosting your market competitiveness and paving the way for higher-paying job opportunities. The speed of your progress is in your hands – you set the pace, and we provide the solutions and support to help you achieve your desired outcomes.");
})
test.describe.parallel('Articles', () => {
  // override the retry number here, it will retry all the tests inside this describe blocks 2 times, while in config we have retry number value is 1
  test.describe.configure({retries: 2})
  test('verify delete article', async ({ page, request, globalsAPIURL }, test, ) => {
    // retry if you wana clear DB entries, etc
    if(test.retry){}
    const responseCreateArticle = await request.post(`${globalsAPIURL}/articles`, {
      data: {
        "article":{"title":`${fake_name}`,"description":`${fake_name}`,"body":`${fake_name}`,"tagList":[`${fake_name}`]}
      },
    })
    const responseCreateArticleBody = await responseCreateArticle.json()
    expect(responseCreateArticle.status()).toEqual(201)
    
    page.reload()
    await expect(page.locator('app-article-list h1').first()).toContainText(`${fake_name}`);
    await expect(page.locator('app-article-list p').first()).toContainText(`${fake_name}`);
  
    const responseDeleteArticle = await request.delete(`${globalsAPIURL}/articles/${responseCreateArticleBody.article.slug}`, {
    })
    expect(responseDeleteArticle.status()).toEqual(204)
    
    page.reload()
    await expect(page.locator('app-article-list h1').first()).toContainText('Discover Bondar Academy: Your Gateway to Efficient Learning');
    await expect(page.locator('app-article-list p').first()).toContainText("Discover Bondar Academy's unique place in the educational landscape, where value-focused and efficient learning approaches converge. Our goal is to rapidly enhance your professional technical skills, boosting your market competitiveness and paving the way for higher-paying job opportunities. The speed of your progress is in your hands – you set the pace, and we provide the solutions and support to help you achieve your desired outcomes.");
  });
})