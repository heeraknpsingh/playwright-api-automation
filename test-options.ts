import { test as base } from '@playwright/test'

export type TestOptions = {
    globalsAPIURL: string
    testOutput: string
}

export const test = base.extend<TestOptions>({
    globalsAPIURL:['', { option: true}],
    
    testOutput: async({}, use) => {
        console.log('started')
        await use('')
        console.log('finishing')
    }
})