<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { Menu } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    :class="cn('h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors', props.class)"
    @click="toggleSidebar"
  >
    <Menu class="h-5 w-5 text-gray-700" />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
