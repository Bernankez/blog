/* eslint-disable no-new */
import type { MaybeRefOrGetter } from "vue";
import { ref, toValue, watch } from "vue";
import Zdog from "zdog";

export interface UseCowModelOptions {
  zoom?: number;
  scale?: number;
}

const TAU = Zdog.TAU;

export function useCowModel(el: MaybeRefOrGetter<string | HTMLCanvasElement | SVGSVGElement | undefined | null>, options?: MaybeRefOrGetter<UseCowModelOptions | undefined>) {
  const isPlaying = ref(false);
  const scene = ref<Zdog.Illustration>();

  watch([() => toValue(el), () => toValue(options)], ([el, options]) => {
    if (el) {
      scene.value = createModel(el, options);
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

  function createModel(el: string | HTMLCanvasElement | SVGSVGElement, options?: UseCowModelOptions) {
    const { scale, zoom = 1 } = options || {};

    const illo = new Zdog.Illustration({
      element: el,
      dragRotate: true,
      scale,
      zoom,
      rotate: {
        x: -TAU / 30,
        y: -TAU / 15,
      },
    });

    const headGroup = new Zdog.Group({
      addTo: illo,
    });

    const stroke = 40;

    // face
    // #region
    const topHeight = 30;
    const topWidth = 50;
    const bottomWidth = 125;
    const bottomHeight = 60;
    new Zdog.Shape({
      path: [
        { x: 0, y: -topHeight },
        {
          bezier: [
            { x: topWidth / 2, y: -topHeight },
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
          bezier: [
            { x: -topWidth / 2, y: -topHeight },
            { x: -topWidth / 2, y: -topHeight },
            { x: 0, y: -topHeight },
          ],
        },
      ],
      addTo: headGroup,
      closed: false,
      fill: true,
      color: "#fbf7ed",
      stroke,
    });
    // #endregion

    // horn
    // #region
    const hornLeft = new Zdog.Cone({
      addTo: headGroup,
      diameter: topWidth / 5,
      length: topHeight / 3 * 2,
      stroke: 10,
      color: "#ebb540",
      translate: {
        y: -topHeight - 10,
        x: -topWidth / 2,
      },
      rotate: {
        x: TAU / 6,
        y: TAU / 6,
      },
    });
    hornLeft.copy({
      translate: {
        y: -topHeight - 10,
        x: topWidth / 2,
      },
      rotate: {
        x: TAU / 6,
        y: -TAU / 6,
      },
    });
    // #endregion

    // ear
    // #region
    const earLeft = new Zdog.Shape({
      path: [
        { x: -topWidth / 1.25, y: -topHeight / 1.25 },
        {
          bezier: [
            { x: -topWidth / 1.25, y: -topHeight / 1.25 },
            { x: -topWidth, y: -topHeight / 2 },
            { x: -topWidth * 1.25, y: -topHeight / 2 },
          ],
        },
        {
          bezier: [
            { x: -topWidth * 1.25, y: -topHeight / 2 },
            { x: -topWidth * 1.25, y: -topHeight / 8 },
            { x: -topWidth / 1.25, y: -topHeight / 3 },
          ],
        },
      ],
      addTo: headGroup,
      closed: true,
      fill: true,
      color: "#fbf7ed",
      stroke: 10,
    });
    earLeft.copy({
      path: [
        { x: topWidth / 1.25, y: -topHeight / 1.25 },
        {
          bezier: [
            { x: topWidth / 1.25, y: -topHeight / 1.25 },
            { x: topWidth, y: -topHeight / 2 },
            { x: topWidth * 1.25, y: -topHeight / 2 },
          ],
        },
        {
          bezier: [
            { x: topWidth * 1.25, y: -topHeight / 2 },
            { x: topWidth * 1.25, y: -topHeight / 8 },
            { x: topWidth / 1.25, y: -topHeight / 3 },
          ],
        },
      ],
    });
    // #endregion

    // nose
    // #region
    const noseGroup = new Zdog.Group({
      addTo: headGroup,
    });

    new Zdog.Ellipse({
      translate: {
        x: 0,
        y: bottomHeight / 2,
        z: stroke / 2,
      },
      addTo: noseGroup,
      width: bottomWidth / 2,
      height: bottomHeight / 3,
      stroke,
      color: "#b79784",
      fill: true,
      backface: false,
    });

    // nose
    const noseHoleLeft = new Zdog.Shape({
      addTo: noseGroup,
      stroke: 10,
      color: "#333",
      translate: {
        x: -bottomWidth / 6,
        y: bottomHeight / 2,
        z: stroke - 10,
      },
      backface: false,
    });
    noseHoleLeft.copy({
      translate: {
        x: bottomWidth / 6,
        y: bottomHeight / 2,
        z: stroke - 10,
      },
    });
    // #endregion

    // eyes
    // #region
    const eyeLeft = new Zdog.Ellipse({
      addTo: headGroup,
      width: 5,
      height: 10,
      stroke: 10,
      fill: true,
      color: "#333",
      translate: {
        x: -topWidth / 3,
        y: -topHeight / 2,
      },
      backface: false,
    });
    eyeLeft.copy({
      translate: {
        x: topWidth / 3,
        y: -topHeight / 2,
      },
    });
    // #endregion

    return illo;
  }

  return {
    scene,

    play,
    pause,
  };
}
