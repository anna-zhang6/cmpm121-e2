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

interface SupplyRow {
  label: string;
  color: string;
  measure: "production" | "consumption";
}

const supplyRows: readonly SupplyRow[] = [
  { label: "Production", color: "#27766b", measure: "production" },
  { label: "Consumption", color: "#a44d23", measure: "consumption" },
];

const firstRowLabelY = 102;
const rowSpacing = 52;
const barOffset = 8;

let assignedToSupplies = defaultCrew;

function drawSupplyRows(shift: ShiftResult): void {
  supplyRows.forEach((row, index) => {
    const labelY = firstRowLabelY + index * rowSpacing;
    const value = shift[row.measure];
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${value}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + barOffset, value * 14, 20);
  });
}

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
  drawSupplyRows(shift);
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
