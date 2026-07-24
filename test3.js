// Implment checks to bring validation in the test. Checks are used to validate the response of the request. If the check fails, it will be reported in the test results.

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 3, // Number of virtual users
  duration: '10s', // Duration of the test
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.5'], // Less than 0.5% of requests should fail
    checks: ['rate>0.9'], // At least 90% of checks should pass
  },
};


export default function () {
  const url = 'https://test.k6.io';
  const response = http.get(url); // Send a GET request to the specified URL & Get 200 OK response

    // Implement checks to validate the response
    check(response, {
      'Is status code 200?': (r) => r.status === 200,
      'Is response time less than 500ms?': (r) => r.timings.duration < 500,
      'Is response body contains Pizza?': (r) => r.body.includes('Pizza'),
    });
}
