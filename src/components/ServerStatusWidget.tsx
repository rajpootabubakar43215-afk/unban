import { useEffect, useState } from "react";
import { Server, Wifi, WifiOff, Map as MapIcon, Users } from "lucide-react";
import { Lightning } from "@/components/Lightning";
import { cn } from "@/lib/utils";

// NOTE: Real RCON requires a UDP server. We surface server identity from config
// and show a heartbeat ping using the SFTP fetch as a proxy.
export function ServerStatusWidget({
  online,
  lastSync,
}: {
  online: boolean;
  lastSync: number | null;
}) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    if (!lastSync) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 800);
    return () => clearTimeout(t);
  }, [lastSync]);

  return (
    <div className="cyber-frame relative overflow-hidden p-5">
      <Lightning className="opacity-20" color={online ? "primary" : "destructive"} />
      <div className="relative flex items-center gap-2">
        <Server className="h-4 w-4 text-primary neon-icon" />
        <h3 className="font-display text-sm font-black uppercase tracking-[0.2em]">
          Server Status
        </h3>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 cyber-frame-sm px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
            online
              ? "bg-primary/15 text-primary"
              : "bg-destructive/15 text-destructive",
          )}
        >
          {online ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          {online ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      <dl className="relative mt-4 space-y-2 font-mono text-xs">
        <Row label="HOST" value="alpha.optiklink.com" />
        <Row label="GAME PORT" value="4252" />
        <Row label="SFTP PORT" value="2022" />
        <Row label="MOD" value="CoDaM MiscMod" />
        <Row label="GAME" value="Call of Duty 1.1" />
      </dl>

      <div
        className={cn(
          "relative mt-4 cyber-frame-sm bg-background/40 p-3 transition",
          pulse && "ring-1 ring-primary shadow-[0_0_20px_-3px_hsl(var(--primary)/0.6)]",
        )}
      >
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapIcon className="h-3 w-3 text-primary" />
            Heartbeat
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3 w-3 text-primary" />
            via SFTP
          </span>
        </div>
        <div className="mt-2 flex items-end gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary/60"
              style={{
                height: `${8 + ((i * 7 + (lastSync ?? 0)) % 22)}px`,
                opacity: i > 18 ? 1 : 0.3 + (i / 24) * 0.5,
                boxShadow: i > 20 ? "0 0 6px hsl(var(--primary))" : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-primary/10 pb-1.5">
      <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
      <dd className="truncate text-foreground">{value}</dd>
    </div>
  );
}
