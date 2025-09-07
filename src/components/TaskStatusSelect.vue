<script setup lang="ts">
import { computed } from 'vue'
import type { TaskStatus } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TASK_STATUS_OPTIONS } from '@/enums'
import { CheckCircle, Clock, Circle } from 'lucide-vue-next'

interface Props {
  status: TaskStatus
  disabled?: boolean
}

interface Emits {
  (event: 'update:status', value: TaskStatus): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})
const emits = defineEmits<Emits>()

const statusOptions = TASK_STATUS_OPTIONS.map(option => ({
  ...option,
  icon: option.icon === 'Circle' ? Circle : option.icon === 'Clock' ? Clock : CheckCircle
}))

const selectedOption = computed(() => statusOptions.find(option => option.value === props.status))

const handleStatusChange = (value: unknown) => {
  if (value && typeof value === 'string') {
    emits('update:status', value as TaskStatus)
  }
}
</script>

<template>
  <Select :model-value="status" @update:model-value="handleStatusChange" :disabled="disabled">
    <SelectTrigger class="w-full">
      <SelectValue>
        <div class="flex items-center gap-2" v-if="selectedOption">
          <component :is="selectedOption.icon" :class="`h-4 w-4 ${selectedOption.color}`" />
          <span>{{ selectedOption.label }}</span>
        </div>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="option in statusOptions" :key="option.value" :value="option.value">
        <div class="flex items-center gap-2">
          <component :is="option.icon" :class="`h-4 w-4 ${option.color}`" />
          <span>{{ option.label }}</span>
        </div>
      </SelectItem>
    </SelectContent>
  </Select>
</template>