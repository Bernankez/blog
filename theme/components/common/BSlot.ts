import { computed, defineComponent, h } from "vue";
import { slotToVNode } from "../../utils/vue";

export const BSlot = defineComponent((_, { slots, attrs }) => {
  const slotVNode = computed(() => slotToVNode(slots.default, "default"));

  return () => h(slotVNode.value, { ...attrs });
});
