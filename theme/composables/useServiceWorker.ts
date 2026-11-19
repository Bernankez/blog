import { useSessionStorage } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";

declare const __PWA_VERSION__: string;

export function useServiceWorker() {
  const offlineReady = ref(false);
  const version = ref("");
  const dismissed = useSessionStorage("pwa-dismissed-version", "");
  const needRefresh = computed(() => version.value !== dismissed.value && version.value);
  let registration: ServiceWorkerRegistration | undefined;
  let cleanup: (() => void) | undefined;
  let reloadTimer: number | undefined;

  function updateServiceWorker() {
    if (reloadTimer !== undefined) {
      return;
    }
    registration?.waiting?.postMessage({ type: "SKIP_WAITING" });
    reloadTimer = window.setTimeout(() => window.location.reload(), 3000);
  }

  onMounted(async () => {
    if (import.meta.env.DEV || !("serviceWorker" in navigator)) {
      return;
    }
    const abort = new AbortController();
    const options = { signal: abort.signal };
    const check = () => {
      if (!document.hidden) {
        registration?.update().catch(() => {});
      }
    };
    const interval = window.setInterval(check, 60 * 60 * 1000);
    cleanup = () => {
      abort.abort();
      clearInterval(interval);
      clearTimeout(reloadTimer);
    };
    document.addEventListener("visibilitychange", check, options);
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadTimer !== undefined) {
        window.location.reload();
      }
    }, options);

    try {
      const reg = await navigator.serviceWorker.register("/sw.js", { updateViaCache: "none" });
      if (abort.signal.aborted) {
        return;
      }
      registration = reg;
      const inspect = (worker: ServiceWorker) => {
        if (!navigator.serviceWorker.controller) {
          offlineReady.value = true;
          return;
        }
        const { port1, port2 } = new MessageChannel();
        const timer = window.setTimeout(() => port1.close(), 3000);
        port1.onmessage = ({ data }) => {
          clearTimeout(timer);
          port1.close();
          if (abort.signal.aborted || reg.waiting !== worker || typeof data !== "string") {
            return;
          }
          if (data === __PWA_VERSION__) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
          else {
            version.value = data;
          }
        };
        worker.postMessage({ type: "GET_VERSION" }, [port2]);
      };
      const trackInstall = () => {
        const worker = reg.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed") {
            inspect(worker);
          }
        }, options);
      };
      reg.addEventListener("updatefound", trackInstall, options);
      trackInstall();
      if (reg.waiting) {
        inspect(reg.waiting);
      }
    }
    catch (error) {
      console.error("Service worker registration error!", error);
    }
  });
  onUnmounted(() => cleanup?.());

  return { offlineReady, needRefresh, dismissed, updateServiceWorker };
}
