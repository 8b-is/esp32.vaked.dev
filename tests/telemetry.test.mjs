import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../deploy/worker.js", import.meta.url), "utf8");
const { default: worker } = await import(
  "data:text/javascript;base64," + Buffer.from(source).toString("base64")
);

const request = (path, options) => new Request("https://synthetic.invalid" + path, options);

test("CORS preflight and observation auth responses include authorization header support", async () => {
  const optResp = await worker.fetch(request("/api/upload", { method: "OPTIONS" }));
  assert.equal(optResp.status, 204);
  assert.match(optResp.headers.get("access-control-allow-headers") || "", /\bauthorization\b/i);

  for (const path of ["/api/wigle.csv", "/wigle.csv", "/api/upload", "/api/v2/file/upload"]) {
    const dis = await worker.fetch(request(path), { TELEMETRY_TOKEN: "DISABLED" });
    assert.equal(dis.status, 503);
    assert.equal(dis.headers.get("access-control-allow-origin"), "*");

    const unauth = await worker.fetch(request(path), { TELEMETRY_TOKEN: "synthetic-secret" });
    assert.equal(unauth.status, 401);
    assert.equal(unauth.headers.get("access-control-allow-origin"), "*");
  }
});

test("oversized bodies and streamed body overflow are rejected without mutating export", async () => {
  const env = { TELEMETRY_TOKEN: "synthetic-secret" };
  const headers = { authorization: "Bearer synthetic-secret" };
  const before = await (await worker.fetch(request("/api/wigle.csv", { headers }), env)).text();

  const resp1 = await worker.fetch(
    request("/api/upload", { method: "POST", headers, body: "x".repeat(65537) }),
    env
  );
  assert.equal(resp1.status, 413);
  assert.equal(await (await worker.fetch(request("/api/wigle.csv", { headers }), env)).text(), before);

  let cancelled = false;
  const streamBody = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(32768));
      controller.enqueue(new Uint8Array(32769));
    },
    cancel() {
      cancelled = true;
    }
  });
  const resp2 = await worker.fetch(
    request("/api/upload", { method: "POST", headers, body: streamBody, duplex: "half" }),
    env
  );
  assert.equal(resp2.status, 413);
  assert.equal(cancelled, true);
  assert.equal(await (await worker.fetch(request("/api/wigle.csv", { headers }), env)).text(), before);
});

test("row capacity is transactional at 1000 rows and existing rows can be updated", async () => {
  const { default: isolated } = await import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64") + "#row-capacity"
  );
  globalThis.fetch = async () => new Response(JSON.stringify({ ok: true, transId: "syn-1" }), { status: 200 });
  const env = { TELEMETRY_TOKEN: "synthetic-secret" };
  const headers = { authorization: "Bearer synthetic-secret" };
  const makeRow = (i, ssid = "SYN") => {
    const hi = Math.floor(i / 256).toString(16).padStart(2, "0").toUpperCase();
    const lo = (i % 256).toString(16).padStart(2, "0").toUpperCase();
    return `02:00:00:00:${hi}:${lo},${ssid},W2,0,6,-55,35.68,139.69,40,5,WIFI`;
  };
  const upload = (body) => isolated.fetch(request("/api/upload", { method: "POST", headers, body }), env);
  const snapshot = async () => await (await isolated.fetch(request("/api/wigle.csv", { headers }), env)).text();

  // Initial seed has 8 rows; add 992 new rows to reach 1000 total
  const batch992 = Array.from({ length: 992 }, (_, i) => makeRow(i)).join("\n");
  assert.equal((await upload(batch992)).status, 200);
  const full = await snapshot();
  assert.equal(full.trim().split(/\r?\n/).length, 1002);

  // Adding a 1001st distinct MAC must fail transactionally without mutating row 0
  assert.equal((await upload(makeRow(0, "MUTATED") + "\n" + makeRow(999))).status, 413);
  assert.equal(await snapshot(), full);

  // Updating an existing MAC within the 1000-row cap succeeds
  assert.equal((await upload(makeRow(0, "REPLACED"))).status, 200);
  assert.match(await snapshot(), /02:00:00:00:00:00,REPLACED,/);
});

test("escapeHtml in index.html prevents HTML injection in radio-provided text", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  assert.match(html, /function escapeHtml\(/);
  assert.match(html, /\$\{escapeHtml\(ap\.bssid\)\}/);
  assert.match(html, /escapeHtml\(ap\.ssid\)/);
  assert.match(html, /\$\{escapeHtml\(ap\.capabilities\)\}/);
});

