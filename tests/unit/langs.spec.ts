import isEqual from 'lodash/isEqual'
import isObject from 'lodash/isObject'

import { en } from '@/views/locales/en'
import { ru } from '@/views/locales/ru'

test('All localization files should have the same keys', () => {
  const checkDeep = (
    obj1: Record<string, unknown>,
    obj2: Record<string, unknown>
  ) => {
    const ruKeys = Object.keys(obj1)
    const enKeys = Object.keys(obj2)

    expect(ruKeys).toEqual(enKeys)

    if (!isEqual(ruKeys, enKeys)) {
      return
    }

    Object.entries(obj1).forEach(([key, value]) => {
      if (isObject(value) !== isObject(obj2[key])) {
        expect(true).toBe(false)
        return
      }

      if (isObject(value)) {
        checkDeep(
          value as Record<string, unknown>,
          obj2[key] as Record<string, unknown>
        )
      }
    })
  }

  checkDeep(en, ru)
})
