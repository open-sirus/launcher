import axios from 'axios'
import { createWriteStream } from 'fs'

export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string
): Promise<undefined> {
  const writer = createWriteStream(outputLocationPath)

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer)
      let error: Error | null = null

      writer.on('error', (err) => {
        error = err
        writer.close()
        reject(err)
      })

      writer.on('close', () => {
        if (!error) {
          resolve(undefined)
        }
      })
    })
  })
}
