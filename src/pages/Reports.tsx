import { useEffect, useMemo, useState } from "react";
import { Search, Flag, Globe, User, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useServerData } from "@/hooks/useServerData";
import { renderCodName, stripCodColors } from "@/lib/codColors";
import { formatDate } from "@/lib/banUtils";
import { Lightning } from "@/components/Lightning";
import { LiveStatusBar } from "@/components/LiveStatusBar";

const Reports = () => {
  const { reports, loading, error, fetchedAt, refresh } = useServerData();
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = "Player Reports | EURO Rifles";
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (!q) return true;
      return (
        stripCodColors(r.reportedName).toLowerCase().includes(q) ||
        r.reporter.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q) ||
        r.reportedIp.includes(q)
      );
    }).sort((a, b) => b.reportedAt - a.reportedAt);
  }, [query, reports]);

  return (
    <div className="container py-10">
      <section className="cyber-frame corner-brackets scanline relative overflow-hidden p-8 md:p-10">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]">
            <Flag className="h-3.5 w-3.5 text-gold neon-icon-gold" />
            <span className="text-gold">Community Reports</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-gold/15">
                <Flag className="relative z-10 h-8 w-8 text-gold neon-icon-gold" />
                <Lightning color="gold" />
              </div>
            </div>
            <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              PLAYER REPORTS
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground">
            Reports submitted by players in-game. Admins review these before issuing bans. Pulled live from the game server.
          </p>
        </div>
      </section>

      <div className="mt-4">
        <LiveStatusBar loading={loading} error={error} fetchedAt={fetchedAt} onRefresh={refresh} />
      </div>

      <section className="cyber-frame mt-4 p-4 md:p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary neon-icon" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reporter, reported player, IP or reason..."
              className="border-primary/30 bg-background/60 pl-10 font-mono text-sm focus-visible:ring-primary"
            />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-primary">{filtered.length}</span> / {reports.length}
          </span>
        </div>
      </section>

      {loading && reports.length === 0 ? (
        <div className="cyber-frame mt-6 py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 font-mono text-sm text-muted-foreground">// Pulling live reports from server...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="cyber-frame mt-6 py-16 text-center">
          <Flag className="mx-auto h-10 w-10 text-muted-foreground/30" />
          <p className="mt-4 font-mono text-sm text-muted-foreground">// No reports found</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="cyber-frame relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-[0_0_30px_-5px_hsl(var(--gold)/0.4)]"
            >
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gold shadow-[0_0_10px_hsl(var(--gold))]" />
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-display text-lg font-bold">
                      {renderCodName(r.reportedName)}
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                      <Globe className="h-3 w-3 text-primary/70" />
                      <span className="text-foreground/80">{r.reportedIp}</span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-destructive/90">
                      Reason:
                    </span>{" "}
                    <span className="font-medium text-foreground">{r.reason}</span>
                  </p>
                  <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                    <User className="h-3 w-3 text-primary/80" />
                    Reported by{" "}
                    <span className="text-primary neon-text-soft">{r.reporter}</span>
                    <span className="text-muted-foreground/70">({r.reporterIp})</span>
                  </p>
                </div>
                <div className="cyber-frame-sm flex shrink-0 items-center gap-1.5 bg-background/40 px-3 py-1.5 font-mono text-xs text-gold">
                  <Clock className="h-3 w-3" />
                  {formatDate(r.reportedAt)}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
