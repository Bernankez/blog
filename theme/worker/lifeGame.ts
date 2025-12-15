// 状态管理
let grid: number[][] = [];
let rows = 0;
let cols = 0;

// 消息处理
globalThis.onmessage = (e: MessageEvent) => {
  if (e.data.type === "init") {
    handleInit(e.data);
  }
  else if (e.data.type === "next") {
    handleNext();
  }
};

// 初始化处理
function handleInit(data: { rows: number; cols: number; seed: boolean[][] }) {
  ({ rows, cols } = data);
  grid = data.seed.map(row => row.map(cell => cell ? 1 : 0));
  globalThis.postMessage({ grid });
}

// 下一代处理
function handleNext() {
  grid = nextGeneration();
  globalThis.postMessage({ grid });
}

// 生命演化计算
function nextGeneration(): number[][] {
  const newGrid = Array.from({ length: rows }).fill(null).map(() => Array.from({ length: cols }, () => 0));

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const neighbors = countNeighbors(i, j);
      newGrid[i][j] = applyRules(grid[i][j], neighbors);
    }
  }
  return newGrid;
}

// 邻居计数
function countNeighbors(x: number, y: number): number {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      const row = (x + i + rows) % rows;
      const col = (y + j + cols) % cols;
      count += grid[row][col];
    }
  }
  return count;
}

// 生命规则应用
function applyRules(currentState: number, neighbors: number): number {
  if (currentState) {
    return neighbors === 2 || neighbors === 3 ? 1 : 0;
  }
  return neighbors === 3 ? 1 : 0;
}
