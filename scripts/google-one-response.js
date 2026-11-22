// Quantumult X: replace the two iOS product IDs on the Google One /ai? page.
const matchesPage = /^https:\/\/one\.google\.com\/ai\?/.test($request.url);
const body = $response.body;

if (!matchesPage || typeof body !== "string") {
  $done({});
} else {
  $done({
    body: body
      .replace(/g1\.ios\.30tb\.ai\.pro\.m/g, "g1.ai.ultra.3months_ip_90p.acq")
      .replace(/g1\.ios\.20tb\.m\.v2/g, "g1.20tb.3months_ip_90p.acq"),
  });
}
