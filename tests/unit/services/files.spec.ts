import Files, { FileCheckProgress } from '@/services/Files'

it('get file hash', async () => {
  await expect(
    Files.getFileHash('/home/user/Name Of Directory/Data/ruRU/patch-9.zip')
  ).resolves.toBe('f9e71fe2c41a10c0a78218e98a025520')
})

it('get file hash', async () => {
  const progressMock = jest.fn()
  expect.assertions(2)

  const path = '/home/user/Name Of Directory/Data/ruRU/patch-9.zip'

  await Files.getFileHash(path, progressMock)

  expect(progressMock).toHaveBeenNthCalledWith(
    1,
    new FileCheckProgress(7, path, 0)
  )
  expect(progressMock).toHaveBeenNthCalledWith(
    2,
    new FileCheckProgress(7, path, 7)
  )
})
