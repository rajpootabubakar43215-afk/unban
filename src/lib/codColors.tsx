import React from "react";

// Call of Duty color code mapping (^0-^9)
const COD_COLORS: Record<string, string> = {
  "0": "hsl(var(--cod-black))",
  "1": "hsl(var(--cod-red))",
  "2": "hsl(var(--cod-green))",
  "3": "hsl(var(--cod-yellow))",
  "4": "hsl(var(--cod-blue))",
  "5": "hsl(var(--cod-cyan))",
  "6": "hsl(var(--cod-pink))",
  "7": "hsl(var(--cod-white))",
  "8": "hsl(var(--cod-white))",
  "9": "hsl(var(--cod-grey))",
};

export function renderCodName(name: string): React.ReactNode {
  if (!name) return null;
  const parts: { text: string; color: string }[] = [];
  let current = "";
  let color = COD_COLORS["7"];
  for (let i = 0; i < name.length; i++) {
    if (name[i] === "^" && i + 1 < name.length && COD_COLORS[name[i + 1]]) {
      if (current) parts.push({ text: current, color });
      current = "";
      color = COD_COLORS[name[i + 1]];
      i++;
    } else {
      current += name[i];
    }
  }
  if (current) parts.push({ text: current, color });
  return (
    <>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color }}>
          {p.text}
        </span>
      ))}
    </>
  );
}

export function stripCodColors(name: string): string {
  return name.replace(/\^[0-9]/g, "");
}
