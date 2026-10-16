export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

const crewSize = 6;
const defaultCrew = 2;
const suppliesPerCrew = 3;
const shiftConsumption = 6;

let assignedToSupplies = defaultCrew;

function clampAssignment(count: number): number {
  return Math.max(0, Math.min(crewSize, count));
}

function formatBalance(balance: number): string {
  return `${balance > 0 ? "+" : ""}${balance}`;
}

function drawCrewSlots(assigned: number): void {
  for (let i = 0; i < crewSize; i++) {
    ctx.fillStyle = i < assigned ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < assigned ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function supply() {
  const production = assignedToSupplies * suppliesPerCrew;
  const consumption = shiftConsumption;
  const balance = production - consumption;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewSlots(assignedToSupplies);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${assignedToSupplies} / ${crewSize}`, 18, 76);
  ctx.fillText(`Production: ${production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, consumption * 14, 20);
  readout.textContent =
    `Assigned: ${assignedToSupplies}/${crewSize} · Production: ${production} · Consumption: ${consumption} · Balance: ${
      formatBalance(balance)
    }`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  assignedToSupplies = clampAssignment(assignedToSupplies - 1);
  supply();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  assignedToSupplies = clampAssignment(assignedToSupplies + 1);
  supply();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    assignedToSupplies = defaultCrew;
    supply();
  };
supply();
