<template>
  <div class="content" @click="$emit('click')">
    <h1 class="title is-2">{{ title }}</h1>
    <div class="block">
      <p v-for="(paragraph, index) in paragraphs" :key="index" class="mb-4">
        {{ paragraph }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  text: string
}

const props = defineProps<Props>()

defineEmits<{
  click: []
}>()

// Divise le texte en paragraphes basés sur les retours à la ligne
const paragraphs = computed(() => {
  if (!props.text) return []
  return props.text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
})
</script>

<style scoped>
.content {
  cursor: pointer;
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.content:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>
