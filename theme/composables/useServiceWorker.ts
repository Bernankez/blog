import { onBeforeMount, ref } from "vue";

export function useServiceWorker() {
  const offlineReady = ref(false);
  const needRefresh = ref(false);
  const updateServiceWorker = ref<() => Promise<void>>();

  function close() {
    offlineReady.value = false;
    needRefresh.value = false;
  }

  onBeforeMount(async () => {
    const { registerSW } = await import("virtual:pwa-register");
    updateServiceWorker.value = registerSW({
      immediate: true,
      onOfflineReady() {
        offlineReady.value = true;
      },
      onNeedRefresh() {
        needRefresh.value = true;
      },
      onRegistered() {
        // eslint-disable-next-line no-console
        console.log("Service worker registered");
      },
      onRegisterError(error) {
        console.error("Service worker registration error!", error);
      },
    });
  });

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    close,
  };
}
