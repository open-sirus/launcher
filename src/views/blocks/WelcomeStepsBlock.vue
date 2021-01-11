<template>
  <div class="welcome-steps">
    <transition name="step-slide">
      <component :is="stepComponent" />
    </transition>
    <v-row class="button-row">
      <v-col align-self="start">
        <v-btn :disabled="isFirstStep" @click="prevStep">
          {{ $t('steps.prev-step') }}
        </v-btn>
      </v-col>
      <v-col align-self="end">
        <v-btn @click="nextStep">
          {{ $t('steps.next-step') }}
        </v-btn>
      </v-col>
      <v-col align-self="end">
        <v-btn color="primary" @click="skipWelcomeScreen">
          {{ $t('steps.skip') }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { createNamespacedHelpers } from 'vuex-composition-helpers'
import { defineComponent } from '@vue/composition-api'

import SelectFolderStep from '@/views/components/welcomeSteps/SelectFolder.vue'
import type {
  IWelcomeActions,
  IWelcomeGetters,
  IWelcomeState,
} from '@/views/store/modules/welcome'
import LoginStep from '@/views/components/welcomeSteps/Login.vue'
import { WelcomeSteps } from '@/types/welcomeSteps'
import { eventService } from '@/background/EventService'
import { LauncherEvent } from '@/events/LauncherEvent'
import { CallbackListener } from '@/events/CallbackListener'

const {
  useActions: useWelcomeActions,
  useGetters: useWelcomeGetters,
} = createNamespacedHelpers<IWelcomeState, IWelcomeGetters, IWelcomeActions>(
  'welcome'
)

const componentByStepType = {
  [WelcomeSteps.SETUP]: 'select-folder-step',
  [WelcomeSteps.LOGIN]: 'login-step',
}

export default defineComponent({
  components: {
    SelectFolderStep,
    LoginStep,
  },
  setup() {
    const { nextStep, prevStep, setIsCompleted } = useWelcomeActions([
      'nextStep',
      'prevStep',
      'setIsCompleted',
    ])
    const { currentStep, currentStepIndex, stepsCount } = useWelcomeGetters([
      'currentStep',
      'currentStepIndex',
      'stepsCount',
    ])

    eventService.on(
      LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED,
      new CallbackListener<LauncherEvent.CORRECT_GAME_DIRECTORY_SELECTED>(
        () => {
          nextStep()
        }
      )
    )

    eventService.on(
      LauncherEvent.TORRENT_DOWNLOAD_STARTED,
      new CallbackListener<LauncherEvent.TORRENT_DOWNLOAD_STARTED>(() => {
        nextStep()
      })
    )

    return {
      currentStep,
      currentStepIndex,
      stepsCount,
      nextStep,
      prevStep,
      setIsCompleted,
    }
  },
  computed: {
    stepComponent() {
      return componentByStepType[this.currentStep as WelcomeSteps]
    },
    isFirstStep() {
      return this.currentStepIndex === 0
    },
  },
  methods: {
    skipWelcomeScreen() {
      // @ts-ignore
      this.setIsCompleted(true)
    },
  },
})
</script>

<style scoped>
.welcome-steps {
  height: 400px;

  display: flex;
  align-items: center;
  flex-direction: column;
}

.welcome-steps .button-row {
  margin-top: auto;
}

.welcome-steps .row {
  flex: initial;
}

.step-slide-enter-active {
  transition: all 0.3s ease;
}

.step-slide-enter,
.step-slide-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
