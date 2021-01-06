import { promises as fs } from 'fs'

/**
 * Return all files in directory that starts with same prefix
 */
export async function getFilesWithPrefix(
  path: string,
  prefix: string
): Promise<Array<string>> {
  const files = await fs.readdir(path)
  const normalizedPrefix = prefix.toLocaleLowerCase()

  return files.filter((f) => f.toLocaleLowerCase().startsWith(normalizedPrefix))
}
