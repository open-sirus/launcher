import mock from 'mock-fs'

import {
  isCorrectClientDirectory,
  isCorrectFile,
  isFileExists,
  removeFile,
  getFileHash,
  FileCheckProgress,
  getFilesWithPrefix,
} from '@/utils/files'

describe('File helper', () => {
  const FILE = mock.file({
    content: Buffer.from([8, 6, 7, 5, 3, 0, 9]),
    ctime: new Date(1),
    mtime: new Date(1),
  })

  beforeEach(() => {
    mock({
      '/home/user/Name Of Directory/Data/ruRU': {
        'patch-9.zip': FILE,
        'patch-10.zip': FILE,
        'file.zip': FILE,
      },
    })
  })

  afterAll(() => {
    mock.restore()
  })

  it('file exists', async () => {
    expect.assertions(1)

    expect(await isFileExists('/home/user/Name Of Directory/Data')).toBe(true)
  })

  it('file exists non-case sensitive filename', async () => {
    expect.assertions(1)

    expect(await isFileExists('/home/user/Name Of Directory/Data/ruRU')).toBe(
      true
    )
  })

  it('check right directory structure', async () => {
    expect(await isCorrectClientDirectory('/home/user/Name Of Directory')).toBe(
      true
    )
  })

  it('check right directory structure', async () => {
    expect(await isCorrectClientDirectory('/home/user')).toBe(false)
  })

  it('remove file', async () => {
    await removeFile('/home/user/Name Of Directory/Data/ruRU/patch-9.zip')

    expect(
      await isFileExists('/home/user/Name Of Directory/Data/ruRU/patch-9.zip')
    ).toBe(false)
  })

  it('check file', async () => {
    expect(
      await isCorrectFile(
        '/home/user/Name Of Directory/Data/ruRU/patch-9.zip',
        FILE().getContent().length,
        new Date(1).getTime()
      )
    ).toBe(true)
  })

  it('check file including without timestamp', async () => {
    expect(
      await isCorrectFile(
        '/home/user/Name Of Directory/Data/ruRU/patch-9.zip',
        FILE().getContent().length
      )
    ).toBe(true)
  })

  it('get file hash', async () => {
    await expect(
      getFileHash('/home/user/Name Of Directory/Data/ruRU/patch-9.zip')
    ).resolves.toBe('f9e71fe2c41a10c0a78218e98a025520')
  })

  it('get list files with prefix', async () => {
    await expect(
      getFilesWithPrefix('/home/user/Name Of Directory/Data/ruRU', 'PATCH')
    ).resolves.toStrictEqual([
      'patch-10.zip',
      'patch-9.zip',
    ])
  })

  it('get file hash', async () => {
    const progressMock = jest.fn()
    expect.assertions(2)

    const path = '/home/user/Name Of Directory/Data/ruRU/patch-9.zip'

    await getFileHash(path, progressMock)

    expect(progressMock).toHaveBeenNthCalledWith(
      1,
      new FileCheckProgress(7, path, 0)
    )
    expect(progressMock).toHaveBeenNthCalledWith(
      2,
      new FileCheckProgress(7, path, 7)
    )
  })
})
