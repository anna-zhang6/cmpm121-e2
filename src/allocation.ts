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

interface ShiftResult {
  assigned: number;
  crewSize: number;
  production: number;
  consumption: number;
  balance: number;
}

function calculateShift(assigned: number): ShiftResult {
  const production = assigned * suppliesPerCrew;
  const consumption = shiftConsumption;
  return {
    assigned,
    crewSize,
    production,
    consumption,
    balance: production - consumption,
  };
}

let assignedToSupplies = defaultCrew;

function clampAssignment(count: number): number {
  return Math.max(0, Math.min(crewSize, count));
}

function formatBalance(balance: number): string {
  return `${balance > 0 ? "+" : ""}${balance}`;
}

function drawCrewSlots(shift: ShiftResult): void {
  for (let i = 0; i < shift.crewSize; i++) {
    ctx.fillStyle = i < shift.assigned ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < shift.assigned ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
}

function drawChart(shift: ShiftResult): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCrewSlots(shift);
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${shift.assigned} / ${shift.crewSize}`, 18, 76);
  ctx.fillText(`Production: ${shift.production}`, 18, 102);
  ctx.fillStyle = "#27766b";
  ctx.fillRect(18, 110, shift.production * 14, 20);
  ctx.fillStyle = "#233e43";
  ctx.fillText(`Consumption: ${shift.consumption}`, 18, 154);
  ctx.fillStyle = "#a44d23";
  ctx.fillRect(18, 162, shift.consumption * 14, 20);
}

function readOut(shift: ShiftResult): void {
  readout.textContent =
    `Assigned: ${shift.assigned}/${shift.crewSize} · Production: ${shift.production} · Consumption: ${shift.consumption} · Balance: ${
      formatBalance(shift.balance)
    }`;
}

function supply() {
  const shift = calculateShift(assignedToSupplies);
  drawChart(shift);
  readOut(shift);
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
