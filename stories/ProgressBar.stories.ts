import { text, number } from '@storybook/addon-knobs'

import ProgressBar from '@/views/components/common/ProgressBar.vue'

export default {
  title: 'ProgressBar',
}

export const exampleWithKnobs = () => ({
  components: { ProgressBar },
  props: {
    status: {
      default: text('status', '10/20', 'progress'),
    },
    progress: {
      default: number('progress', 0, { min: 0, max: 100 }, 'progress'),
    },
    title: {
      default: text('title', 'Валидация файлов...', 'progress'),
    },
  },
  template:
    '<progress-bar :status="status" :progress="progress" :title="title" />',
})
