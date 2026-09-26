/**
 * Keen-Keeper Backend API Automated Test Suite
 * Run with: node scripts/test-api.js
 */

const API_BASE = process.env.API_URL || "http://localhost:5000";

async function runTests() {
  console.log(`\n🧪 Starting Keen-Keeper API Test Suite against ${API_BASE}...\n`);
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // 1. Health endpoint test
  await test("GET /api/health returns status OK", async () => {
    const res = await fetch(`${API_BASE}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== "OK") throw new Error("Expected status OK");
  });

  // 2. Status endpoint test
  await test("GET /api/status returns running message", async () => {
    const res = await fetch(`${API_BASE}/api/status`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.message || !data.message.includes("Keen-Keeper")) throw new Error("Unexpected status response");
  });

  // 3. Friends listing & favorites filter test
  await test("GET /api/friends returns array and supports query parameters", async () => {
    const res = await fetch(`${API_BASE}/api/friends?limit=10`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected an array of friends");
  });

  // 4. Upcoming birthdays endpoint test
  await test("GET /api/friends/upcoming/birthdays returns upcoming celebration list", async () => {
    const res = await fetch(`${API_BASE}/api/friends/upcoming/birthdays`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected an array of birthdays");
  });

  // 5. Activities endpoint test
  await test("GET /api/activities returns list of touchpoints", async () => {
    const res = await fetch(`${API_BASE}/api/activities?limit=10`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Expected an array of activities");
  });

  // 6. Analytics summary test
  await test("GET /api/analytics/summary returns health score and breakdown", async () => {
    const res = await fetch(`${API_BASE}/api/analytics/summary`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.healthScore !== "number") throw new Error("Expected healthScore number");
  });

  // 7. Backup export test
  await test("GET /api/backup/export returns valid backup JSON structure", async () => {
    const res = await fetch(`${API_BASE}/api/backup/export`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.app !== "Keen-Keeper" || !Array.isArray(data.friends)) throw new Error("Invalid backup format");
  });

  console.log(`\n🏁 Test Results: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner exception:", err);
  process.exit(1);
});
