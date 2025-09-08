<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card'
import type { Component } from 'vue'

interface Props {
  icon?: Component
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <Card>
    <CardContent class="text-center py-12">
      <component
        v-if="icon"
        :is="icon"
        class="h-16 w-16 text-gray-300 mx-auto mb-4"
      />
      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ title }}</h3>
      <p class="text-gray-500 mb-6 leading-relaxed">
        <slot>{{ description }}</slot>
      </p>
    </CardContent>
  </Card>
</template>
