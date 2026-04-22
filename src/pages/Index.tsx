import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Shield, Flag, Mail, ArrowRight, Lock, Activity } from "lucide-react";
import { useServerData } from "@/hooks/useServerData";
import { isActive, isPermanent } from "@/lib/banUtils";
import { Lightning } from "@/components/Lightning";
import { LiveStatusBar } from "@/components/LiveStatusBar";
import { AdminLeaderboard } from "@/components/AdminLeaderboard";
import { ReasonsAnalytics } from "@/components/ReasonsAnalytics";
import { PlayerLookup } from "@/components/PlayerLookup";
import { ServerStatusWidget } from "@/components/ServerStatusWidget";
import { DiscordWidget } from "@/components/DiscordWidget";
import { cn } from "@/lib/utils";

const Index = () => {
  const { bans, reports, loading, error, fetchedAt, refresh } = useServerData();

  useEffect(() => {
    document.title = "Eluminar Rifles S&D — Public Ban List & Appeal";
    const desc =
      "Live ban list, player reports and unban appeal portal for the Eluminar Rifles S&D CoD 1.1 server.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
    }
    m.setAttribute("content", desc);
  }, []);

  const stats = [
    { label: "Total Bans", value: bans.length, icon: Shield, color: "primary" as const },
    { label: "Permanent", value: bans.filter(isPermanent).length, icon: Lock, color: "destructive" as const },
    { label: "Active Now", value: bans.filter((b) => isActive(b)).length, icon: Activity, color: "primary" as const },
    { label: "Reports", value: reports.length, icon: Flag, color: "primary" as const },
  ];

  const cards = [
    { to: "/bans", title: "Ban List", desc: "See who got banned, by which admin, when, and why.", icon: Shield, cta: "Open" },
    { to: "/reports", title: "Reports", desc: "Community-submitted reports — hackers, cheaters, abusive players.", icon: Flag, cta: "View" },
    { to: "/appeal", title: "Unban Appeal", desc: "Banned by mistake? Submit your case directly to the admin team.", icon: Mail, cta: "Submit" },
  ];

  const online = !error;

  return (
    <div className="container py-10">
      <section className="cyber-frame corner-brackets scanline relative overflow-hidden p-8 md:p-14">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <Lightning className="absolute -right-20 top-0 h-full w-1/2 opacity-20" />
        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]">
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
            <span className="text-primary">SYSTEM ONLINE</span>
            <span className="text-muted-foreground">// ELUMINAR RIFLES S&D</span>
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
            <span className="block text-foreground">TRUST BUILT ON</span>
            <span className="block neon-text">TRANSPARENCY</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm text-muted-foreground md:text-base">
            Official ban portal — every ban public, every admin accountable, and every player has the right to plead their case.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/bans" className="cyber-frame-sm inline-flex items-center gap-2 bg-primary/20 px-6 py-3 font-display text-xs font-black uppercase tracking-[0.25em] text-primary hover:bg-primary/30 hover:shadow-[0_0_25px_-3px_hsl(var(--primary)/0.7)] neon-text-soft">
              <Shield className="h-4 w-4" /> View Bans
            </Link>
            <Link to="/appeal" className="cyber-frame-sm inline-flex items-center gap-2 bg-surface-elevated/60 px-6 py-3 font-display text-xs font-black uppercase tracking-[0.25em] text-foreground hover:text-primary">
              <Mail className="h-4 w-4" /> Submit Appeal
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-4">
        <LiveStatusBar loading={loading} error={error} fetchedAt={fetchedAt} onRefresh={refresh} />
      </div>

      <section className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => {
          const isRed = color === "destructive";
          return (
            <div key={label} className={cn("cyber-frame relative overflow-hidden p-5", isRed ? "bg-destructive/[0.04]" : "bg-primary/[0.03]")}>
              <Lightning color={color} className="opacity-25" />
              <div className="relative flex items-center justify-between">
                <p className={cn("font-mono text-[10px] uppercase tracking-[0.25em]", isRed ? "text-destructive/80" : "text-primary/80")}>
                  {label}
                </p>
                <Icon className={cn("h-5 w-5", isRed ? "text-destructive neon-icon-red" : "text-primary neon-icon")} />
              </div>
              <p className={cn("relative mt-2 font-display text-3xl font-black tabular-nums", isRed ? "text-destructive neon-text-red" : "text-primary neon-text")}>
                {value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Heavy features grid */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <AdminLeaderboard bans={bans} />
        <ReasonsAnalytics bans={bans} />
        <PlayerLookup bans={bans} reports={reports} />
        <DiscordWidget />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {cards.map(({ to, title, desc, icon: Icon, cta }) => (
          <Link key={to} to={to} className="cyber-frame group relative overflow-hidden p-6 transition hover:-translate-y-1 hover:shadow-[0_0_35px_-5px_hsl(var(--primary)/0.6)]">
            <div className="relative h-12 w-12">
              <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-primary/15">
                <Icon className="relative z-10 h-6 w-6 text-primary neon-icon" />
                <Lightning className="opacity-60" />
              </div>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold uppercase tracking-wider">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            <div className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary neon-text-soft">
              {cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Index;
