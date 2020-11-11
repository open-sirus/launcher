import { mocked } from 'ts-jest/utils'

import LauncherFile from '@/entities/LauncherFile'
import LauncherEvent from '@/events/LauncherEvent'
import {
  FileManageService,
  FileManageStatus,
  FileValidationProgress,
} from '@/services/FileManageService'
import eventService from '@/background/EventService'
import { getFileHash, isCorrectFile } from '@/utils/files'

jest.mock('@/background/EventService')
jest.mock('@/utils/files')

describe('File manage service tests', () => {
  const MockedEventService = mocked(eventService, true)
  const MockedGetFileHash = mocked(getFileHash)
  const MockedIsCorrectFile = mocked(isCorrectFile)

  beforeEach(() => {
    MockedEventService.emit.mockClear()
    MockedGetFileHash.mockClear()
    MockedIsCorrectFile.mockClear()
  })

  const RAW_FILES = [
    {
      filename: 'patch-d.zip',
      path: '/Data/',
      size: 174954589,
      md5: '393ABCBA77B8E369DD83109CBA76A285',
      host: 'http://51.15.228.31:8080/api/client/patches/',
      storagePath: '/new-live/',
      updatedAt: '2019-06-05',
    },
    {
      filename: 'patch-ruRU-6.zip',
      path: '/Data/ruRU/',
      size: 25191304,
      md5: '0522CA7960F8E3D7CB445D5CF109E682',
      host: 'http://51.15.228.31:8080/api/client/patches/',
      storagePath: '/new-live/',
      updatedAt: '2020-04-16',
    },
  ]

  it('hash will not calculated if size is different', async () => {
    const files = RAW_FILES.map(LauncherFile.fromObject)
    const service = new FileManageService()

    expect.assertions(2)

    MockedIsCorrectFile.mockReturnValueOnce(
      new Promise<boolean>((resolve) => resolve(false))
    )

    expect(await service.isValidFile(files[0])).toBeFalsy()
    expect(MockedGetFileHash).not.toBeCalled()
  })

  it('calculate and compare hash if size same', async () => {
    const files = RAW_FILES.map(LauncherFile.fromObject)
    const service = new FileManageService()

    expect.assertions(2)

    MockedIsCorrectFile.mockReturnValueOnce(
      new Promise<boolean>((resolve) => resolve(true))
    )

    MockedGetFileHash.mockReturnValueOnce(
      new Promise<string>((resolve) =>
        resolve('393ABCBA77B8E369DD83109CBA76A285'.toLocaleLowerCase())
      )
    )

    expect(await service.isValidFile(files[0])).toBeTruthy()
    expect(MockedGetFileHash).toBeCalled()
  })

  it('files validated and event published', async () => {
    const files = RAW_FILES.map(LauncherFile.fromObject)
    const service = new FileManageService()

    service.isValidFile = jest.fn().mockReturnValue(true)

    expect.assertions(3)

    await service.validate('/dummy/path', files)

    expect(service.isValidFile).toHaveBeenCalledTimes(2)

    expect(MockedEventService.emit).toHaveBeenNthCalledWith(
      1,
      LauncherEvent.FILE_MANAGER_STATUS_CHANGED,
      {
        progress: new FileValidationProgress(2, 0, 0),
        status: FileManageStatus.VALIDATING,
      }
    )

    expect(MockedEventService.emit).toHaveBeenNthCalledWith(
      8,
      LauncherEvent.FILE_MANAGER_STATUS_CHANGED,
      {
        progress: new FileValidationProgress(2, 2, 0),
        status: FileManageStatus.VALIDATING,
      }
    )
  })
})
