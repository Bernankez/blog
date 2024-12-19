<script setup lang="ts">
import { ref } from "vue";
import BSearchBox from "./BSearchBox.vue";
import BSearchButton from "./BSearchButton.vue";

const show = ref(false);
</script>

<template>
  <div id="local-search">
    <BSearchButton v-model="show" @click="show = true" />
  </div>
  <BSearchBox v-if="show" @close="show = false" />
</template>
