<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import { useCowModel } from "../../composables/useCowModel";

const { scale, zoom, width, height } = defineProps<{
  width?: number;
  height?: number;
  scale?: number;
  zoom?: number;
}>();

const dragging = ref(false);
const cursor = ref<string>();
const canvasRef = ref<HTMLCanvasElement>();
useCowModel(canvasRef, () => ({
  scale,
  zoom,
}));

useEventListener(canvasRef, "pointerdown", () => {
  dragging.value = true;
  if (document.body) {
    cursor.value = document.body.style.cursor;
    const stopMoveFn = useEventListener(canvasRef, "pointermove", () => {
      if (dragging.value && document) {
        document.body.style.setProperty("cursor", "grabbing");
      }
    });
    const stopUpFn = useEventListener("pointerup", () => {
      dragging.value = false;
      if (cursor.value) {
        document.body.style.setProperty("cursor", cursor.value);
      } else {
        document.body.style.removeProperty("cursor");
      }
      stopMoveFn();
      stopUpFn();
    });
  }
});
</script>

<template>
  <canvas ref="canvasRef" :class="[dragging && 'cursor-grabbing']" :height :width @pointerdown="dragging = true" @pointerup="dragging = false"></canvas>
</template>
