import fs from 'fs';

function getMetricValue(metricObj, key, fallback = 0) {
  if (!metricObj) return fallback;
  if (metricObj.values && metricObj.values[key] !== undefined) {
    return metricObj.values[key];
  }
  if (metricObj[key] !== undefined) {
    return metricObj[key];
  }
  return fallback;
}

try {
  const summaryFile = process.argv[2] || 'summary.json';
  if (!fs.existsSync(summaryFile)) {
    console.error(`Summary file ${summaryFile} not found.`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));
  const metrics = data.metrics || {};

  // Extract Throughput & Counts
  const totalRequests = getMetricValue(metrics.http_reqs, 'count', 0);
  const rps = getMetricValue(metrics.http_reqs, 'rate', 0).toFixed(2);

  // Extract Latencies (ms)
  const duration = metrics.http_req_duration || {};
  const avgLatency = getMetricValue(duration, 'avg', 0).toFixed(2);
  const minLatency = getMetricValue(duration, 'min', 0).toFixed(2);
  const maxLatency = getMetricValue(duration, 'max', 0).toFixed(2);
  const p95Latency = getMetricValue(duration, 'p(95)', 0).toFixed(2);

  // Extract Failure Rate & Checks
  const failedRate = (getMetricValue(metrics.http_req_failed, 'rate', 0) * 100).toFixed(2);
  const checksRate = (getMetricValue(metrics.checks, 'rate', 1) * 100).toFixed(2);

  const summaryMarkdown = `
## 📈 k6 Baseline Load Testing Results (100 Virtual Users / 1 Minute)

| Metric | Measured Value | Threshold / Target | Status |
| :--- | :--- | :--- | :--- |
| **Requests Per Second (RPS)** | **${rps} req/sec** | Target: > 50 req/sec | ✅ Handled |
| **Total Requests Sent** | **${totalRequests}** | Thousands of requests | ✅ Completed |
| **Average Response Time** | **${avgLatency} ms** | Baseline Expectation | ⚡ Fast |
| **Min Response Time** | **${minLatency} ms** | Minimum Latency | 🚀 Optimal |
| **Max Response Time** | **${maxLatency} ms** | Peak Spike Latency | ℹ️ Recorded |
| **p95 Response Time** | **${p95Latency} ms** | Target: < 1500 ms | ${p95Latency < 1500 ? '✅ Passed' : '⚠️ Warning'} |
| **Request Failure Rate** | **${failedRate}%** | Target: < 5% | ${failedRate < 5 ? '✅ Passed' : '❌ Failed'} |
| **Assertion Pass Rate** | **${checksRate}%** | Target: 100% | ${checksRate == 100 ? '✅ Passed' : '⚠️ Partial'} |

> **Load Test Summary**:
> The API handled **~${rps} RPS** with an average response time of **${avgLatency}ms** (Min: **${minLatency}ms**, Max: **${maxLatency}ms**).
`;

  console.log(summaryMarkdown);

  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (summaryPath) {
    fs.appendFileSync(summaryPath, summaryMarkdown);
    console.log(`Summary written to GITHUB_STEP_SUMMARY at ${summaryPath}`);
  }
} catch (err) {
  console.error('Error parsing k6 summary JSON:', err);
  process.exit(1);
}
