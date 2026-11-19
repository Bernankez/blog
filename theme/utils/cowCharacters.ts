// Sample the completed Zdog frame, then replace it with glyphs on the same drag target.
export function createCowCharacterRenderer(canvas: HTMLCanvasElement) {
  const ratio = window.devicePixelRatio || 1;
  const cellWidth = 4.5;
  const cellHeight = 7;
  const grid = document.createElement("canvas");
  grid.width = Math.ceil(canvas.width / ratio / cellWidth);
  grid.height = Math.ceil(canvas.height / ratio / cellHeight);
  const sample = grid.getContext("2d", { willReadFrequently: true })!;
  const ctx = canvas.getContext("2d")!;
  const glyphs = ["+", "@", "=", ":"];
  const eyesAndNostrils = "#302c28";
  const lightInk = ["#aa7624", eyesAndNostrils, "#835f50", "#918679"];
  const darkInk = ["#e9bc67", eyesAndNostrils, "#d3ac92", "#e3d8c4"];

  return (dark: boolean) => {
    sample.clearRect(0, 0, grid.width, grid.height);
    sample.drawImage(canvas, 0, 0, grid.width, grid.height);
    const { data } = sample.getImageData(0, 0, grid.width, grid.height);
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(ratio, ratio);
    ctx.font = "bold 8px monospace";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    const ink = dark ? darkInk : lightInk;
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 48) {
        continue;
      }
      // Horns, eyes/nostrils, muzzle and face retain their contrasting ink weights.
      const part = data[i + 1] - data[i + 2] > 60 ? 0 : data[i] < 100 ? 1 : data[i] < 218 ? 2 : 3;
      ctx.fillStyle = ink[part];
      ctx.globalAlpha = a / 255;
      const cell = i / 4;
      ctx.fillText(glyphs[part], (cell % grid.width + 0.5) * cellWidth, (Math.floor(cell / grid.width) + 0.5) * cellHeight);
    }
    ctx.restore();
  };
}
