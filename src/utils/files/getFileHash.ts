import { promises as fs, createReadStream } from 'fs'
import crypto from 'crypto'

export class FileCheckProgress {
  public bytes = 0
  public bytesDone = 0
  public path: string | null = null

  constructor(bytes: number, path: string, bytesDone: number) {
    this.bytes = bytes
    this.path = path
    this.bytesDone = bytesDone
  }
}

/**
 * Return md5 hash of exist file
 * @param path - path to file
 * @param onProgress
 */
export async function getFileHash(
  path: string,
  onProgress?: (progress: FileCheckProgress) => void
) {
  const stats = await fs.stat(path)

  const hash = crypto.createHash('md5')
  const fileStream = createReadStream(path)

  let bytesDone = 0

  if (onProgress) {
    onProgress(new FileCheckProgress(stats.size, path, bytesDone))
  }

  return new Promise((resolve, reject) => {
    fileStream.on('data', (data) => {
      hash.update(data)
      bytesDone += data.length
      if (onProgress) {
        onProgress(new FileCheckProgress(stats.size, path, bytesDone))
      }
    })

    fileStream.on('end', () => {
      resolve(hash.digest('hex').toLocaleLowerCase())
    })

    fileStream.on('error', (error) => {
      reject(error)
    })
  })
}
