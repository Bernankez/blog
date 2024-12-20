<script setup lang="ts">
import { ref } from "vue";
import BLocalSearchBox from "./BLocalSearchBox.vue";
import BSearchButton from "./BSearchButton.vue";

const show = ref(false);
</script>

<template>
  <div id="local-search">
    <BSearchButton v-model="show" @click="show = true" />
  </div>
  <BLocalSearchBox v-if="show" @close="show = false" />
</template>
