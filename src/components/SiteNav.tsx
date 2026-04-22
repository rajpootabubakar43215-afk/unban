import { NavLink } from "react-router-dom";
import { Shield, Flag, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightning } from "@/components/Lightning";

const links = [
  { to: "/bans", label: "Bans", icon: Shield },
  { to: "/reports", label: "Reports", icon: Flag },
  { to: "/appeal", label: "Appeal", icon: Mail },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary/30 bg-background/85 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-0 -bottom-px h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.8), transparent)",
        }}
      />
      <div className="container flex h-20 items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12">
            <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-destructive/15">
              <Shield className="relative z-10 h-6 w-6 text-destructive neon-icon-red" />
              <Lightning color="destructive" className="opacity-70" />
            </div>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl font-black tracking-[0.15em] text-foreground">
              PUBLIC BAN LIST
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Eluminar Rifles S&D
            </span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-2">
          {links.map(({ to, label, icon: Icon }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-2 px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] transition-all cyber-frame-sm",
                    isActive
                      ? "bg-destructive/15 text-destructive shadow-[0_0_25px_-3px_hsl(var(--destructive)/0.7)]"
                      : "bg-surface-elevated/40 text-muted-foreground hover:text-primary"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={cn("h-4 w-4", isActive ? "neon-icon-red" : "group-hover:neon-icon")} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
