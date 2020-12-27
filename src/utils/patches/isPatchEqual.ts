import pick from 'lodash/pick'
import isEqual from 'lodash/isEqual'

const FIELDS_TO_COMPARE = ['path', 'filename', 'host', 'md5', 'hash', 'size']

export function isPatchEqual(
  patch: Record<string, unknown>,
  otherPatch: Record<string, unknown>
) {
  return isEqual(
    pick(patch, FIELDS_TO_COMPARE),
    pick(otherPatch, FIELDS_TO_COMPARE)
  )
}
