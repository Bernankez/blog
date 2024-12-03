/* eslint-disable no-new */
import { type MaybeRefOrGetter, ref, toValue, watch } from "vue";
import Zdog from "zdog";

export interface UseCowModelOptions {
}

export function useCowModel(el: MaybeRefOrGetter<string | HTMLCanvasElement | SVGSVGElement | undefined | null>) {
  const isPlaying = ref(false);
  const scene = ref<Zdog.Illustration>();

  watch(() => toValue(el), (el) => {
    if (el) {
      scene.value = createModel(el);
      render();
    }
  }, {
    immediate: true,
  });

  function render() {
    if (scene.value) {
      scene.value.rotate.y += isPlaying.value ? 0.03 : 0;
      scene.value.updateRenderGraph();
      requestAnimationFrame(render);
    }
  }

  function play() {
    isPlaying.value = true;
  }

  function pause() {
    isPlaying.value = false;
  }

  function createModel(el: string | HTMLCanvasElement | SVGSVGElement) {
    const illo = new Zdog.Illustration({
      element: el,
      dragRotate: true,
    });

    const headGroup = new Zdog.Group({
      addTo: illo,
    });

    // TODO 角
    // 眼睛
    // 鼻子

    // face
    const topHeight = 30;
    const topWidth = 50;
    const bottomWidth = 125;
    const bottomHeight = 60;
    new Zdog.Shape({
      path: [
        { x: 0, y: -topHeight },
        {
          arc: [
            { x: topWidth / 2, y: -topHeight },
            { x: topWidth / 2, y: 0 },
          ],
        },
        {
          bezier: [
            { x: bottomWidth / 2, y: bottomHeight },
            { x: -bottomWidth / 2, y: bottomHeight },
            { x: -topWidth / 2, y: 0 },
          ],
        },
        {
          arc: [
            { x: -topWidth / 2, y: -topHeight },
            { x: 0, y: -topHeight },
          ],
        },
      ],
      addTo: headGroup,
      closed: false,
      fill: true,
      color: "#999",
      stroke: 40,
    });

    return illo;
  }

  return {
    scene,

    play,
    pause,
  };
}
