import { useEffect, useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Lightning } from "@/components/Lightning";
import { cn } from "@/lib/utils";

const DISCORD_WEBHOOK =
  "https://discord.com/api/webhooks/1495732289093632014/QLaINTKG_BPIzQ1WNPKVFxIhL35VQwaKSAVMAFRCB26NB6XrqnEpcQ-tC4bFuS6Lu3eV";

const appealSchema = z.object({
  playerName: z.string().trim().min(2, "Min 2 characters").max(64),
  ip: z.string().trim().max(45).optional().or(z.literal("")),
  discord: z.string().trim().max(64).optional().or(z.literal("")),
  banReason: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(20, "At least 20 characters").max(1500, "Max 1500 chars"),
});

const Appeal = () => {
  const [form, setForm] = useState({ playerName: "", ip: "", discord: "", banReason: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    document.title = "Unban Appeal | EURO Rifles";
  }, []);

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = appealSchema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (k && !fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      return;
    }

    setStatus("sending");
    try {
      const payload = {
        username: "Unban Appeal Bot",
        embeds: [
          {
            title: "📩 New Unban Appeal",
            color: 0x00ff66,
            fields: [
              { name: "👤 Player Name", value: form.playerName || "—", inline: true },
              { name: "🌐 IP Address", value: form.ip || "Not provided", inline: true },
              { name: "💬 Discord", value: form.discord || "Not provided", inline: true },
              { name: "⚠️ Ban Reason (claimed)", value: form.banReason || "Not provided" },
              { name: "📝 Appeal Message", value: form.message.slice(0, 1024) },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "EURO Rifles • Public Appeal Portal" },
          },
        ],
      };
      const res = await fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      toast({ title: "Appeal submitted", description: "Your appeal has been delivered to the admin team." });
      setForm({ playerName: "", ip: "", discord: "", banReason: "", message: "" });
    } catch {
      setStatus("idle");
      toast({
        title: "Failed to submit",
        description: "Webhook could not be reached. Please try again shortly.",
        variant: "destructive",
      });
    }
  };

  if (status === "sent") {
    return (
      <div className="container flex min-h-[70vh] items-center justify-center py-10">
        <div className="cyber-frame corner-brackets relative max-w-md p-10 text-center">
          <div className="relative mx-auto h-16 w-16">
            <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-primary/15">
              <CheckCircle2 className="relative z-10 h-8 w-8 text-primary neon-icon" />
              <Lightning />
            </div>
          </div>
          <h2 className="mt-5 font-display text-2xl font-black uppercase tracking-wider text-primary neon-text">
            APPEAL SENT
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Your appeal has been transmitted to the admin team. You will be contacted on Discord regarding the decision.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="cyber-frame-sm mt-6 bg-primary/15 px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-primary hover:bg-primary/25"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <section className="cyber-frame corner-brackets scanline relative overflow-hidden p-8 md:p-10">
        <div className="cyber-grid absolute inset-0 opacity-40" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em]">
            <Mail className="h-3.5 w-3.5 text-primary neon-icon" />
            <span className="text-primary">Appeal Channel</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0">
              <div className="cyber-frame-sm absolute inset-0 flex items-center justify-center bg-primary/15">
                <Send className="relative z-10 h-8 w-8 text-primary neon-icon" />
                <Lightning />
              </div>
            </div>
            <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-5xl">
              UNBAN APPEAL
            </h1>
          </div>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground">
            Submit your defence — your appeal is delivered straight to the admins' Discord channel.
          </p>
        </div>
      </section>

      <div className="cyber-frame mt-6 flex items-start gap-3 border-l-[3px] border-l-gold p-4 text-sm">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-gold neon-icon-gold" />
        <p>
          <span className="font-bold text-gold">Honesty notice:</span>{" "}
          Lying in your appeal will get it rejected and may turn your ban permanent.
        </p>
      </div>

      <form onSubmit={submit} className="cyber-frame mt-6 space-y-5 p-6 md:p-8">
        <Field label="In-game Player Name *" error={errors.playerName}>
          <Input
            value={form.playerName}
            onChange={update("playerName")}
            placeholder="Your in-game name"
            maxLength={64}
            className="border-primary/30 bg-background/60 font-mono focus-visible:ring-primary"
          />
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="IP Address (optional)" error={errors.ip}>
            <Input
              value={form.ip}
              onChange={update("ip")}
              placeholder="e.g. 119.154.242.25"
              maxLength={45}
              className="border-primary/30 bg-background/60 font-mono focus-visible:ring-primary"
            />
          </Field>
          <Field label="Discord Username (optional)" error={errors.discord}>
            <Input
              value={form.discord}
              onChange={update("discord")}
              placeholder="username"
              maxLength={64}
              className="border-primary/30 bg-background/60 font-mono focus-visible:ring-primary"
            />
          </Field>
        </div>

        <Field label="Reason you were banned for" error={errors.banReason}>
          <Input
            value={form.banReason}
            onChange={update("banReason")}
            placeholder="e.g. hacking, abuse, spam..."
            maxLength={200}
            className="border-primary/30 bg-background/60 font-mono focus-visible:ring-primary"
          />
        </Field>

        <Field label="Your Appeal *" error={errors.message}>
          <Textarea
            value={form.message}
            onChange={update("message")}
            placeholder="// Explain why you should be unbanned..."
            rows={7}
            maxLength={1500}
            className="border-primary/30 bg-background/60 font-mono focus-visible:ring-primary"
          />
          <p className="mt-1 text-right font-mono text-[10px] text-muted-foreground">
            {form.message.length} / 1500
          </p>
        </Field>

        <button
          type="submit"
          disabled={status === "sending"}
          className={cn(
            "relative w-full cyber-frame-sm bg-primary/20 py-4 font-display text-sm font-black uppercase tracking-[0.3em] text-primary transition",
            "hover:bg-primary/30 hover:shadow-[0_0_30px_-3px_hsl(var(--primary)/0.8)] disabled:opacity-60",
            "border-primary/60"
          )}
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2 neon-text-soft">
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Transmitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" /> Submit Appeal
              </>
            )}
          </span>
        </button>
      </form>
    </div>
  );
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary/80">
        // {label}
      </label>
      {children}
      {error && <p className="mt-1 font-mono text-xs text-destructive">! {error}</p>}
    </div>
  );
}

export default Appeal;
