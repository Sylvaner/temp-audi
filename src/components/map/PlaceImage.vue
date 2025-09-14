<template>
  <figure v-if="imageFile" class="image" @click="$emit('click')">
    <img :src="`/images/${imageFile}`" :alt="title" @error="onImageError" class="is-clickable" />
  </figure>
</template>

<script setup lang="ts">
interface Props {
  imageFile?: string
  title: string
}

defineProps<Props>()

defineEmits<{
  click: []
}>()

function onImageError(event: Event) {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.image {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image:hover img {
  transform: scale(1.02);
}

.is-clickable {
  cursor: pointer;
}
</style>
