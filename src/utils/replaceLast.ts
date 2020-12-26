export function replaceLast(find: string, replace: string, string: string) {
  const lastIndex = string.lastIndexOf(find)

  if (lastIndex === -1) {
    return string
  }

  const beginString = string.substring(0, lastIndex)
  const endString = string.substring(lastIndex + find.length)

  return beginString + replace + endString
}
