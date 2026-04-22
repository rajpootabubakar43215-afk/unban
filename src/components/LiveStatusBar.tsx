import { Activity, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/banUtils";

interface Props {
  loading: boolean;
  error: string | null;
  fetchedAt: number | null;
  onRefresh: () => void;
}

export function LiveStatusBar({ loading, error, fetchedAt, onRefresh }: Props) {
  return (
    <div className="cyber-frame-sm flex items-center justify-between gap-3 bg-background/60 px-4 py-2 font-mono text-[11px]">
      <div className="flex items-center gap-2">
        {error ? (
          <>
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
            <span className="text-destructive">SFTP ERROR</span>
            <span className="text-muted-foreground hidden md:inline">// {error.slice(0, 60)}</span>
          </>
        ) : loading && !fetchedAt ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
            <span className="text-primary">CONNECTING TO SERVER...</span>
          </>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <span className="text-primary uppercase tracking-[0.2em]">LIVE</span>
          </>
        )}
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 text-primary hover:text-primary/70 disabled:opacity-50",
          "uppercase tracking-[0.2em]",
        )}
      >
        <Activity className={cn("h-3 w-3", loading && "animate-pulse")} />
        Refresh
      </button>
    </div>
  );
}
