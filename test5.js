import http from 'k6/http';
import { sleep } from 'k6';
import {Trend} from 'k6/metrics';

export const options = {
  vus: 3, // Number of virtual users
  duration: '10s', // Duration of the test
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
  },
};

const myTrend = new Trend('my_trend'); // Create a custom trend metric to track response times

export default function () {
  const url = 'https://test.k6.io';

  const response = http.get(url); // Send a GET request to the specified URL & Get 200 OK response

  myTrend.add(response.timings.duration); // Add the response time to the custom trend metric
  

  sleep(1); // Sleep for 1 second between requests
}