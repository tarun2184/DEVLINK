import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_failed: ['rate<0.05'], // http errors should be less than 5%
    http_req_duration: ['p(95)<1500'], // 95% of requests should be below 1500ms
  },
};

export default function () {
  const targetUrl = __ENV.TARGET_URL || 'https://tarun2184.github.io/DEVLINK/';
  const res = http.get(targetUrl);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
