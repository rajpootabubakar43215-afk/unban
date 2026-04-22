import { useMemo } from "react";
import { PieChart as PieIcon } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { BanRecord } from "@/hooks/useServerData";

const KEYWORDS: { label: string; match: RegExp; color: string }[] = [
  { label: "Hacking / Cheats", match: /hack|cheat|aim|wall|esp|wh\b/i, color: "hsl(var(--destructive))" },
  { label: "Abuse / Toxic", match: /abus|toxic|insult|racist|spam/i, color: "hsl(var(--gold))" },
  { label: "Glitch / Exploit", match: /glitch|exploit|bug|crash/i, color: "hsl(var(--cod-cyan))" },
  { label: "Other", match: /.*/, color: "hsl(var(--primary))" },
];

export function ReasonsAnalytics({ bans }: { bans: BanRecord[] }) {
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of bans) {
      const cat = KEYWORDS.find((k) => k.match.test(b.reason || ""))!.label;
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    }
    return KEYWORDS.map((k) => ({
      name: k.label,
      value: counts.get(k.label) ?? 0,
      color: k.color,
    })).filter((d) => d.value > 0);
  }, [bans]);

  return (
    <div className="cyber-frame p-5">
      <div className="flex items-center gap-2">
        <PieIcon className="h-4 w-4 text-gold neon-icon-gold" />
        <h3 className="font-display text-sm font-black uppercase tracking-[0.2em]">
          Ban Reasons Analytics
        </h3>
      </div>

      {data.length === 0 ? (
        <p className="mt-6 text-center font-mono text-xs text-muted-foreground">
          // No data to analyze
        </p>
      ) : (
        <div className="mt-3 grid items-center gap-4 md:grid-cols-[160px_1fr]">
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="hsl(var(--background))"
                  strokeWidth={2}
                >
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--background))",
                    border: "1px solid hsl(var(--primary) / 0.4)",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((d) => (
              <div
                key={d.name}
                className="cyber-frame-sm flex items-center justify-between bg-background/40 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5"
                    style={{ background: d.color, boxShadow: `0 0 8px ${d.color}` }}
                  />
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                    {d.name}
                  </span>
                </div>
                <span className="font-display text-lg font-black tabular-nums text-foreground">
                  {d.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
