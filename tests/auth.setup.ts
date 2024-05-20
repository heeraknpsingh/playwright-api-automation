import { expect } from '@playwright/test';
import { test as webauthentication, test as apiauthentication } from '../test-options'
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'
webauthentication('webauthentication', async({page}) =>{
    await page.goto("/")
    await page.locator("[href='/login']").click()
    await page.locator("[placeholder='Email']").fill(`${process.env.EMAIL}`)
    await page.locator("[placeholder='Password']").fill(`${process.env.PASS}`)
    await page.locator("[type='submit']").click()
    await page.waitForResponse('*/**/api/tags')
    await page.context().storageState({path: authFile})
})

// apiauthentication runs on 2nd place as execution happens based on name
apiauthentication('apiauthentication', async({ request , globalsAPIURL }  ) =>{
    const responseSignIn = await request.post(`${globalsAPIURL}/users/login`, {
        data: {
            "user":{ "email": `${process.env.EMAIL}`, "password": `${process.env.PASS}` }
        }
    })
    expect(responseSignIn.status()).toEqual(200)
    const responseSignInBody = await responseSignIn.json()
    const accesstoken = responseSignInBody.user.token
    user.origins[0].localStorage[0].value = accesstoken
    fs.writeFileSync(authFile, JSON.stringify(user))
    process.env['ACCESS_TOKEN'] = accesstoken
})