import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
    // Define the stages of the test
    // Each stage specifies a duration and a target number of virtual users (VUs)
    // The test will ramp up and down the number of VUs according to these stages
    // The stages are defined as follows:
    // 1. Ramp up to 5 VUs over 10 seconds
    // 2. Ramp up to 10 VUs over 15 seconds
    // 3. Ramp up to 15 VUs over 15 seconds    

  stages: [
    { duration: '10s', target: 5 },
    { duration: '15s', target: 10 },
    { duration: '15s', target: 15 },
    { duration: '15s', target: 20 },
    { duration: '15s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  // Define thresholds for the test
  // Thresholds are used to set performance goals for the test
  // In this case, we are setting two thresholds:
  // 1. The 95th percentile of request durations should be less than 500 milliseconds
  // 2. The rate of failed requests should be less than 1%
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
  },
};


export default function () {
  const url = 'https://test.k6.io';
  const response = http.get(url); // Send a GET request to the specified URL & Get 200 OK response
  http.get('https://www.google.com'); // Send a GET request to Google
  sleep(1); // Sleep for 1 second between requests
}