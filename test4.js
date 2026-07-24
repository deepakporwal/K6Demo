import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 3, // Number of virtual users
  duration: '10s', // Duration of the test
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
    'http_req_duration{name:api}': ['p(95)<500'],
  },
};


export default function () {
  const url = 'https://test.k6.io';

  const response = http.get(url); // Send a GET request to the specified URL & Get 200 OK response

  const response2 = http.get('https://test.k6.io', {
    tags: { name: 'api' }, // Add a custom tag to the request
  }); // Send a GET request to Google

  sleep(1); // Sleep for 1 second between requests
}