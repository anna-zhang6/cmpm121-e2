export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const gridSize = 5;

interface Direction {
  name: string;
  dx: number;
  dy: number;
}

const directions: readonly Direction[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function clampToGrid(value: number): number {
  return Math.max(0, Math.min(gridSize - 1, value));
}

let x = 2;
let y = 2;
let direction = 0;

interface Command {
  label: string;
  execute: () => void;
}

const forwardCommand: Command = {
  label: "Forward",
  execute: () => {
    const { dx, dy } = directions[direction];
    x = clampToGrid(x + dx);
    y = clampToGrid(y + dy);
  },
};

const rightCommand: Command = {
  label: "Right",
  execute: () => {
    direction = (direction + 1) % 4;
  },
};

function run(command: Command): void {
  command.execute();
  drawRover();
}

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(direction * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[direction].name
  }`;
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  run(forwardCommand);
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  run(rightCommand);
};
document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  direction = 0;
  drawRover();
};
drawRover();
