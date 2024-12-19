<script setup lang="ts">
import { ref } from "vue";
import BSearchButton from "./BSearchButton.vue";

const show = ref(false);

function onClick() {
  // eslint-disable-next-line no-alert
  window.alert("搜索功能正在开发中...");
}
</script>

<template>
  <BSearchButton v-model="show" @click="onClick" />
  <!-- <BSearchBox v-model="show" /> -->
</template>
