<template>
  <span class="inline-block shake cursor-default">
    <ContentSlot :use="$slots.default" unwrap="p" />
  </span>
</template>

<script setup lang="ts">

</script>

<style scoped>
.shake:hover {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 1px, 0);
  }

  20%, 80% {
    transform: translate3d(2px, -2px, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 4px, 0);
  }

  40%, 60% {
    transform: translate3d(4px, -4px, 0);
  }
}
</style>
