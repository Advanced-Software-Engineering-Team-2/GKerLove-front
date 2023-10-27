<template>
  <svg aria-hidden="true">
    <use :xlink:href="symbolId" fill="gray" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  prefix?: string
  name: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  prefix: 'icon',
  color: '#fff'
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
