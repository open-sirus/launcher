import { required, minLength } from '@vuelidate/validators'

export const validateAccountFields = {
  authForm: {
    login: {
      required,
      minLength: minLength(3),
    },
    pass: {
      required,
      minLength: minLength(6),
    },
  },
} as const

export const validateTfa = {
  tfaToken: {
    required,
    minLength: minLength(6),
  },
} as const
