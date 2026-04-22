// Fetches miscmod_bans.dat and miscmod_reports.dat from CoD 1.1 server via SFTP
// Returns parsed JSON for the frontend.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
import Client from "npm:ssh2-sftp-client@10.0.3";

const SFTP_CONFIG = {
  host: "alpha.optiklink.com",
  port: 2022,
  username: "m7wuj930.1df65a15",
  password: "lolopopo",
  readyTimeout: 15000,
};

// Try multiple possible paths — server layout may vary
const BANS_PATHS = ["main/miscmod_bans.dat", "miscmod_bans.dat", "/main/miscmod_bans.dat"];
const REPORTS_PATHS = ["main/miscmod_reports.dat", "miscmod_reports.dat", "/main/miscmod_reports.dat"];

interface BanRecord {
  id: string;
  ip: string;
  admin: string;
  name: string;
  durationSeconds: number;
  bannedAt: number;
  reason: string;
}

interface ReportRecord {
  id: string;
  reporter: string;
  reporterIp: string;
  reportedName: string;
  reportedIp: string;
  reason: string;
  reportedAt: number;
}

function parseBans(raw: string): BanRecord[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const [ip, admin, name, duration, timestamp, ...reasonParts] = line.split("%");
      const dur = Math.abs(parseInt(duration ?? "0", 10)) || 0;
      return {
        id: `ban-${idx}-${ip}`,
        ip: ip ?? "",
        admin: admin ?? "Unknown",
        name: name ?? "Unknown",
        durationSeconds: dur,
        bannedAt: parseInt(timestamp ?? "0", 10),
        reason: reasonParts.join("%") || "No reason provided",
      };
    });
}

function parseReports(raw: string): ReportRecord[] {
  return raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, idx) => {
      const parts = line.split("%");
      const [reporter, reporterIp, reportedName, reportedIp, reason, timestamp] = parts;
      return {
        id: `report-${idx}-${reporterIp}-${idx}`,
        reporter: reporter ?? "Unknown",
        reporterIp: reporterIp ?? "",
        reportedName: reportedName ?? "Unknown",
        reportedIp: reportedIp ?? "",
        reason: reason ?? "No reason",
        reportedAt: parseInt(timestamp ?? "0", 10),
      };
    });
}

async function fetchFirstAvailable(sftp: Client, paths: string[]): Promise<string> {
  for (const p of paths) {
    try {
      const buf = (await sftp.get(p)) as Buffer;
      const content = buf.toString("utf-8");
      console.log(`✓ Loaded ${p} (${content.length} bytes)`);
      return content;
    } catch (err) {
      console.warn(`✗ ${p} not found`);
    }
  }
  return "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const sftp = new Client();
  try {
    console.log("Connecting to SFTP...");
    await sftp.connect(SFTP_CONFIG);
    console.log("Connected. Fetching files...");

    const [bansRaw, reportsRaw] = await Promise.all([
      fetchFirstAvailable(sftp, BANS_PATHS),
      fetchFirstAvailable(sftp, REPORTS_PATHS),
    ]);

    await sftp.end();

    const bans = parseBans(bansRaw);
    const reports = parseReports(reportsRaw);

    console.log(`Parsed ${bans.length} bans, ${reports.length} reports`);

    return new Response(
      JSON.stringify({
        success: true,
        bans,
        reports,
        fetchedAt: Math.floor(Date.now() / 1000),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (err) {
    console.error("SFTP error:", err);
    try { await sftp.end(); } catch (_) { /* noop */ }
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: msg, bans: [], reports: [] }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
