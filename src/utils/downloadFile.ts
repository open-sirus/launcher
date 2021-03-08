import axios from 'axios'
import * as stream from 'stream'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

const finished = promisify(stream.finished)

export async function downloadFile(
  fileUrl: string,
  outputLocationPath: string
): Promise<void> {
  const writer = createWriteStream(outputLocationPath)

  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then(async (response) => {
    response.data.pipe(writer)
    return finished(writer)
  })
}
