// create an end 2 end example

import http from 'k6/http';
import {check} from 'k6';

const BASE_URL = 'https://quickpizza.grafana.com/api/users/token/login';
const USERNAME = 'default';
const PASSWORD = '12345678';

export const options = {
    vus: 2, // Number of virtual users
    duration: '10s', // Duration of the test
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.01'], // Less than 1% of requests should fail
    },
};


export default function () {
    const registerPayload = {
        username: USERNAME,
        password: PASSWORD,
    }

    const paramas = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Step 1: Send a POST request to the base URL
    const response = http.post(BASE_URL, JSON.stringify(registerPayload), {
        params: paramas
    });

    const token = response.json('token');
    console.log('Token value:', token);

    check(response, {
        'is status 200': (r) => r.status === 200,
        'is token present': (r) => token !== undefined,
    });


}