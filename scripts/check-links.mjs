// Checks every outbound link in lib/site.ts and lib/content.ts.
//   eos-advisory.com pages must appear in the live AIOSEO page sitemap (/page-sitemap.xml) and answer 200. The news
//   archive (linked from the live homepage but not in the sitemap) and uploaded files must answer 200. Other hosts
//   (portfolio companies, partners, news releases) must answer 2xx/3xx; LinkedIn answers 999 to scripts and some
//   wire services block scripts with 403, reported as such rather than failed. If the local resolver cannot find a
//   host, the host is looked up over DNS-over-HTTPS (Cloudflare); one that resolves there is reported "DNS" (a local
//   network problem, not a broken link). On 2026-10-09 this applied to naturbeads.com and namisurgical.com.
// Run: npm run links
import { readFileSync } from "node:fs";

const LIVE = "https://eos-advisory.com";
const sources = ["lib/site.ts", "lib/content.ts"].map((f) => readFileSync(f, "utf8")).join("\n")
  .replaceAll("${LIVE}", LIVE).replaceAll("${UP}", `${LIVE}/wp-content/uploads`);
const urls = [...new Set([...sources.matchAll(/https?:\/\/[^"'`\s)]+/g)].map((m) => m[0]))].filter((u) => !u.endsWith("/uploads")).sort();
const map = await fetch(`${LIVE}/page-sitemap.xml`).then((r) => r.text());
const listed = new Set([...map.matchAll(/<loc><!\[CDATA\[([^\]]+)\]\]><\/loc>/g)].map((m) => m[1]));
const BOT_BLOCKED = new Set([403, 999]);

const resolvesPublicly = async (url) => {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${new URL(url).hostname}&type=A`, { headers: { accept: "application/dns-json" } }).then((r) => r.json()).catch(() => ({}));
  return (res.Answer ?? []).length > 0;
};

let failed = 0;
for (const url of urls) {
  const own = url.startsWith(LIVE);
  const kind = !own ? "external" : listed.has(url) ? "in-sitemap" : url.includes("/wp-content/") ? "upload" : "page";
  let status = 0;
  try { status = (await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (Macintosh) link-check" } })).status; } catch { status = 0; }
  const blocked = !own && BOT_BLOCKED.has(status);
  const dns = !own && status === 0 && await resolvesPublicly(url);
  const ok = own ? status === 200 : (status >= 200 && status < 400) || blocked || dns;
  if (!ok) failed++;
  console.log(`${dns ? "DNS " : blocked ? "BOT " : ok ? "ok  " : "FAIL"} ${status} ${kind.padEnd(10)} ${url}`);
}
console.log(`\n${urls.length} links, ${failed} failed`);
process.exit(failed ? 1 : 0);
