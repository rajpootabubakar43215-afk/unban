import { useEffect, useMemo, useState } from "react";
import { Search, Shield, Lock, Clock, Calendar, AlertTriangle, ExternalLink, ShieldAlert, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useServerData } from "@/hooks/useServerData";
import { renderCodName, stripCodColors } from "@/lib/codColors";
import { formatDate, formatTimeRemaining, isActive, isPermanent } from "@/lib/banUtils";
import { cn } from "@/lib/utils";
import { Lightning } from "@/components/Lightning";
import { LiveStatusBar } from "@/components/LiveStatusBar";

const Bans = () => {
  const { bans, loading, error, fetchedAt, refresh } = useServerData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "permanent" | "active">("all");
  const [, setTick] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    document.title = "Public Ban List | EURO Rifles";
  }, []);

  const stats = useMemo(() => ({
    total: bans.length,
    active: bans.filter((b) => isActive(b)).length,
    permanent: bans.filter(isPermanent).length,
  }), [bans]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bans.filter((b) => {
      if (filter === "permanent" && !isPermanent(b)) return false;
      if (filter === "active" && !isActive(b)) return false;
      if (!q) return true;
      return (
        stripCodColors(b.name).toLowerCase().includes(q) ||
        b.admin.toLowerCase().includes(q) ||
        b.ip.includes(q) ||
        b.reason.toLowerCase().includes(q)
      );
    }).sort((a, b) => b.bannedAt - a.bannedAt);
  }, [query, filter, bans]);

  return (
    <div className="container py-10">
      {/* Hero panel */}
      <section className="cyber-frame corner-brackets scanline relative overflow-hidden p-8 md:p-10">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]">
              <span className="h-2 w-2 animate-pulse-dot rounded-full bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]" />
              <span className="text-destructive">LIVE</span>
              <span className="text-muted-foreground">// BAN REGISTRY</span>
            </div>
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 shrink-0">
                <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-destructive/15">
                  <ShieldAlert className="relative z-10 h-8 w-8 text-destructive neon-icon-red" />
                  <Lightning color="destructive" />
                </div>
              </div>
              <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
                <span className="block text-foreground">BANNED</span>
                <span className="block text-foreground">PLAYERS</span>
              </h1>
            </div>
            <p className="mt-5 max-w-md text-sm text-muted-foreground">
              Full transparency: every ban, the admin who issued it, the reason, and exact time remaining. Streamed live from the game server.
            </p>
          </div>

          {/* Stats blocks */}
          <div className="grid grid-cols-3 gap-3">
            <StatBlock label="Total" value={stats.total} color="primary" />
            <StatBlock label="Active" value={stats.active} color="destructive" />
            <StatBlock label="Permanent" value={stats.permanent} color="primary" />
          </div>
        </div>
      </section>

      {/* Live status */}
      <div className="mt-4">
        <LiveStatusBar loading={loading} error={error} fetchedAt={fetchedAt} onRefresh={refresh} />
      </div>

      {/* Search + filters */}
      <section className="cyber-frame mt-4 p-4 md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary neon-icon" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search player, admin, IP or reason..."
              className="border-primary/30 bg-background/60 pl-10 font-mono text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "active", "permanent"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={cn(
                  "cyber-frame-sm px-4 py-2 font-display text-[10px] font-bold uppercase tracking-[0.2em] transition",
                  filter === k
                    ? "bg-primary/20 text-primary shadow-[0_0_20px_-3px_hsl(var(--primary)/0.7)]"
                    : "bg-surface-elevated/50 text-muted-foreground hover:text-primary"
                )}
              >
                {k}
              </button>
            ))}
            <span className="ml-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Showing <span className="text-primary">{filtered.length}</span> / {bans.length}
            </span>
          </div>
        </div>
      </section>

      {/* Ban list */}
      {loading && bans.length === 0 ? (
        <div className="cyber-frame mt-6 py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 font-mono text-sm text-muted-foreground">// Pulling live data from server...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cyber-frame mt-6 py-16 text-center">
          <Shield className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            // {bans.length === 0 ? "No bans on the server right now" : "No bans match your filter"}
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((ban) => {
            const perm = isPermanent(ban);
            const active = isActive(ban);
            return (
              <article
                key={ban.id}
                className={cn(
                  "cyber-frame group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5",
                  perm && "hover:shadow-[0_0_40px_-5px_hsl(var(--destructive)/0.6)]",
                  !perm && active && "hover:shadow-[0_0_40px_-5px_hsl(var(--gold)/0.5)]"
                )}
              >
                <div
                  className={cn(
                    "absolute left-0 top-0 h-full w-[3px]",
                    perm ? "bg-destructive shadow-[0_0_10px_hsl(var(--destructive))]" :
                    active ? "bg-gold shadow-[0_0_10px_hsl(var(--gold))]" :
                    "bg-muted"
                  )}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                      // Player
                    </p>
                    <h3 className="mt-1 truncate font-display text-xl font-bold">
                      {renderCodName(ban.name)}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Globe className="h-3 w-3 text-primary/70" />
                      <span className="text-foreground/80">{ban.ip}</span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 cyber-frame-sm px-3 py-1.5 font-display text-[10px] font-black uppercase tracking-[0.2em]",
                      perm
                        ? "bg-destructive/20 text-destructive"
                        : active
                        ? "bg-gold/20 text-gold"
                        : "bg-muted/40 text-muted-foreground"
                    )}
                  >
                    {perm ? (
                      <span className="inline-flex items-center gap-1">
                        <Lock className="h-3 w-3" /> PERM
                      </span>
                    ) : active ? "ACTIVE" : "EXPIRED"}
                  </span>
                </div>

                <div className="cyber-frame-sm mt-4 bg-background/40 p-3">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-destructive/80">
                    <AlertTriangle className="h-3 w-3" /> Reason
                  </div>
                  <p className="mt-1 text-sm font-medium text-foreground">{ban.reason}</p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <MetaCell icon={Shield} label="Banned by" value={ban.admin} accent />
                  <MetaCell icon={Calendar} label="Date" value={formatDate(ban.bannedAt)} />
                  <div className="col-span-2 cyber-frame-sm relative overflow-hidden bg-gradient-to-r from-background/60 to-surface-elevated/40 p-3">
                    {!perm && active && (
                      <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-gold/10 to-transparent" />
                    )}
                    <div className="relative flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {perm ? "Status" : "Time Remaining"}
                    </div>
                    <p
                      className={cn(
                        "relative mt-1 font-mono text-lg font-black tabular-nums tracking-wider",
                        perm ? "text-destructive neon-text-red" :
                        active ? "text-gold" : "text-muted-foreground"
                      )}
                      style={
                        active && !perm
                          ? { textShadow: "0 0 12px hsl(var(--gold) / 0.6)" }
                          : undefined
                      }
                    >
                      {formatTimeRemaining(ban)}
                    </p>
                  </div>
                </div>

                {ban.proofUrl && (
                  <a
                    href={ban.proofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-primary neon-text-soft hover:underline"
                  >
                    <ExternalLink className="h-3 w-3" /> View Proof
                  </a>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

function StatBlock({ label, value, color }: { label: string; value: number; color: "primary" | "destructive" }) {
  const isRed = color === "destructive";
  return (
    <div className={cn("cyber-frame-sm relative overflow-hidden p-3 text-center", isRed ? "bg-destructive/10" : "bg-primary/5")}>
      <Lightning color={isRed ? "destructive" : "primary"} className="opacity-30" />
      <p className={cn("relative font-mono text-[9px] uppercase tracking-[0.25em]", isRed ? "text-destructive/80" : "text-primary/80")}>
        {label}
      </p>
      <p className={cn("relative mt-1 font-display text-2xl font-black tabular-nums", isRed ? "text-destructive neon-text-red" : "text-primary neon-text")}>
        {value}
      </p>
    </div>
  );
}

function MetaCell({ icon: Icon, label, value, accent }: { icon: typeof Shield; label: string; value: string; accent?: boolean }) {
  return (
    <div className="cyber-frame-sm bg-background/40 p-3">
      <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className={cn("mt-1 truncate text-sm font-bold", accent ? "text-primary neon-text-soft" : "text-foreground")}>
        {value}
      </p>
    </div>
  );
}

export default Bans;
