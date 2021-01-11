import spectron from 'spectron'
import { testWithSpectron } from 'vue-cli-plugin-electron-builder'

jest.setTimeout(50000)

test('a window is created', async () => {
  const { stdout, url, stopServe, app } = await testWithSpectron(spectron)
  console.log(`electron:serve returned: ${stdout}`)
  console.log(`the dev server url is: ${url}`)

  expect(await app.client.getWindowCount()).toBe(1)
  await stopServe()
})
