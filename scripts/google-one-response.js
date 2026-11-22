// Quantumult X response-body script: preserve the original Stash URL scope.
// Performs only the two literal replacements from the source override.
const matchesPage = /^https:\/\/one\.google\.com\/ai\?.*$/.test($request.url);
const body = $response.body;

if (!matchesPage || typeof body !== "string") {
  $done({});
} else {
  $done({
    body: body
      .replace(/30tb\.ai\.pro\.m/g, "30tb.m")
      .replace(/20tb\.m\.v2/g, "20tb.m"),
  });
}
