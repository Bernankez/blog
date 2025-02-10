<script setup lang="ts">
import { useDebounceFn } from "@vueuse/core";
import { onMounted, onUnmounted, ref, watch } from "vue";

export interface WorkerMessage {
  type: "init" | "next";
  rows: number;
  cols: number;
  seed: boolean[][];
}

export interface WorkerResponse {
  grid: number[][];
}

// Props 定义
const { width = 0, height = 0, cellSize = 10, borderColor = "#1a1a1a", cellColor = "#2c3e50", initSeed, speed = 10, probability = 0.7 } = defineProps<{
  width?: number;
  height?: number;
  cellSize?: number;
  borderColor?: string;
  cellColor?: string;
  initSeed?: boolean[][];
  speed?: number;
  probability?: number;
}>();

// Canvas 相关状态
const canvas = ref<HTMLCanvasElement | null>(null);
let worker: Worker | null = null;
let ctx: CanvasRenderingContext2D | null = null;

// Worker 管理
function initWorker() {
  worker = new Worker(new URL("../worker/lifeGame.ts", import.meta.url), {
    type: "module",
  });
}

// Canvas 绘制
function draw(grid: number[][]) {
  if (!ctx || !canvas.value) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, width * dpr, height * dpr);

  ctx.fillStyle = cellColor;
  ctx.strokeStyle = borderColor;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const x = j * cellSize;
      const y = i * cellSize;

      ctx.strokeRect(x, y, cellSize, cellSize);

      if (grid[i][j]) {
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }
  }
}

// Canvas 初始化
function initCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const canvasEl = canvas.value;
  if (!canvasEl) {
    return;
  }

  ctx = canvasEl.getContext("2d");
  if (!ctx) {
    return;
  }

  // 设置 Canvas 物理像素尺寸（考虑 DPR）
  canvasEl.width = width * dpr;
  canvasEl.height = height * dpr;
  // 设置 Canvas CSS 尺寸
  canvasEl.style.width = `${width}px`;
  canvasEl.style.height = `${height}px`;

  // 缩放上下文以匹配 DPR
  ctx.scale(dpr, dpr);

  const rows = Math.floor(height / cellSize) + 1;
  const cols = Math.floor(width / cellSize) + 1;

  // 初始化并配置 Worker
  initWorker();

  if (worker) {
    const message: WorkerMessage = {
      type: "init",
      rows,
      cols,
      seed: initSeed || Array.from({ length: rows }, () => Array.from({ length: cols }, () => Math.random() < probability)),
    };
    worker.postMessage(message);

    let lastTime = 0;
    const interval = 1000 / speed;

    const animate = (currentTime: number) => {
      if (!worker) {
        return;
      }

      if (!lastTime) {
        lastTime = currentTime;
      }
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= interval) {
        worker.postMessage({ type: "next" });
        lastTime = currentTime;
      }

      requestAnimationFrame(animate);
    };

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      draw(e.data.grid);
      if (!lastTime) {
        requestAnimationFrame(animate);
      }
    };
  }
}

// 响应式处理
const handleResize = useDebounceFn(() => {
  worker?.terminate();
  initCanvas();
}, 200);

watch(
  [() => width, () => height],
  () => {
    handleResize();
  },
  { immediate: false },
);

// 生命周期钩子
onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  worker?.terminate();
});
</script>

<template>
  <canvas ref="canvas"></canvas>
</template>
