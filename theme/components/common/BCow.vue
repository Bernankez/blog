<script setup lang="ts">
import { ref } from "vue";
import { useCowModel } from "../../composables/useCowModel";

const canvasRef = ref<HTMLCanvasElement>();
useCowModel(canvasRef);
</script>

<template>
  <canvas ref="canvasRef" class="zdog-canvas"></canvas>
</template>
