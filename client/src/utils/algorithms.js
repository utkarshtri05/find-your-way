import { ALGORITHMS } from "./constants";

class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  enqueue(value, priority) {
    this.heap.push({ value, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (!this.heap.length) {
      return null;
    }

    const first = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length && last) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return first;
  }

  bubbleUp(index) {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = Math.floor((currentIndex - 1) / 2);

      if (this.heap[parentIndex].priority <= this.heap[currentIndex].priority) {
        break;
      }

      [this.heap[parentIndex], this.heap[currentIndex]] = [this.heap[currentIndex], this.heap[parentIndex]];
      currentIndex = parentIndex;
    }
  }

  bubbleDown(index) {
    let currentIndex = index;
    const length = this.heap.length;

    while (true) {
      const leftChildIndex = currentIndex * 2 + 1;
      const rightChildIndex = currentIndex * 2 + 2;
      let smallestIndex = currentIndex;

      if (
        leftChildIndex < length &&
        this.heap[leftChildIndex].priority < this.heap[smallestIndex].priority
      ) {
        smallestIndex = leftChildIndex;
      }

      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex].priority < this.heap[smallestIndex].priority
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === currentIndex) {
        break;
      }

      [this.heap[currentIndex], this.heap[smallestIndex]] = [this.heap[smallestIndex], this.heap[currentIndex]];
      currentIndex = smallestIndex;
    }
  }
}

const directions = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

const makeKey = (row, col) => `${row}:${col}`;

const getMetadata = (algorithmId) => ALGORITHMS.find((algorithm) => algorithm.id === algorithmId) || ALGORITHMS[0];

const getNeighbors = (grid, row, col) =>
  directions
    .map((direction) => ({ row: row + direction.row, col: col + direction.col }))
    .filter((node) => grid[node.row]?.[node.col] && grid[node.row][node.col].kind !== "wall");

const reconstructPath = (previousMap, startNode, endNode) => {
  const path = [];
  let currentKey = makeKey(endNode.row, endNode.col);
  const startKey = makeKey(startNode.row, startNode.col);

  if (!previousMap.has(currentKey) && currentKey !== startKey) {
    return [];
  }

  while (currentKey) {
    const [row, col] = currentKey.split(":").map(Number);
    path.unshift({ row, col });

    if (currentKey === startKey) {
      return path;
    }

    currentKey = previousMap.get(currentKey);
  }

  return [];
};

const calculatePathCost = (grid, path) =>
  path.slice(1).reduce((total, node) => total + (grid[node.row][node.col].weight || 1), 0);

export const runDijkstra = (grid, startNode, endNode) => {
  const distances = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(Infinity));
  const visited = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
  const previousMap = new Map();
  const visitedInOrder = [];
  const queue = new MinPriorityQueue();

  distances[startNode.row][startNode.col] = 0;
  queue.enqueue(startNode, 0);

  while (queue.size) {
    const entry = queue.dequeue();

    if (!entry) {
      break;
    }

    const currentNode = entry.value;

    if (visited[currentNode.row][currentNode.col]) {
      continue;
    }

    visited[currentNode.row][currentNode.col] = true;
    visitedInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      break;
    }

    getNeighbors(grid, currentNode.row, currentNode.col).forEach((neighbor) => {
      if (visited[neighbor.row][neighbor.col]) {
        return;
      }

      const nextDistance = distances[currentNode.row][currentNode.col] + (grid[neighbor.row][neighbor.col].weight || 1);

      if (nextDistance < distances[neighbor.row][neighbor.col]) {
        distances[neighbor.row][neighbor.col] = nextDistance;
        previousMap.set(makeKey(neighbor.row, neighbor.col), makeKey(currentNode.row, currentNode.col));
        queue.enqueue(neighbor, nextDistance);
      }
    });
  }

  const path = reconstructPath(previousMap, startNode, endNode);
  const metadata = getMetadata("dijkstra");

  return {
    algorithm: metadata.id,
    label: metadata.label,
    complexity: metadata.complexity,
    visitedInOrder,
    path,
    visitedCount: visitedInOrder.length,
    pathLength: path.length ? path.length - 1 : 0,
    pathCost: path.length ? calculatePathCost(grid, path) : 0,
    hasPath: Boolean(path.length),
  };
};

export const runBreadthFirstSearch = (grid, startNode, endNode) => {
  const queue = [startNode];
  const visited = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(false));
  const previousMap = new Map();
  const visitedInOrder = [];

  visited[startNode.row][startNode.col] = true;

  while (queue.length) {
    const currentNode = queue.shift();

    if (!currentNode) {
      break;
    }

    visitedInOrder.push(currentNode);

    if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
      break;
    }

    getNeighbors(grid, currentNode.row, currentNode.col).forEach((neighbor) => {
      if (visited[neighbor.row][neighbor.col]) {
        return;
      }

      visited[neighbor.row][neighbor.col] = true;
      previousMap.set(makeKey(neighbor.row, neighbor.col), makeKey(currentNode.row, currentNode.col));
      queue.push(neighbor);
    });
  }

  const path = reconstructPath(previousMap, startNode, endNode);
  const metadata = getMetadata("bfs");

  return {
    algorithm: metadata.id,
    label: metadata.label,
    complexity: metadata.complexity,
    visitedInOrder,
    path,
    visitedCount: visitedInOrder.length,
    pathLength: path.length ? path.length - 1 : 0,
    pathCost: path.length ? path.length - 1 : 0,
    hasPath: Boolean(path.length),
  };
};

export const runAlgorithm = (algorithm, grid, startNode, endNode) =>
  algorithm === "bfs" ? runBreadthFirstSearch(grid, startNode, endNode) : runDijkstra(grid, startNode, endNode);

