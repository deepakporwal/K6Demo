// create an end 2 end example

import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';

const registrationDuration = new Trend('registration_duration');
const getUsersDuration = new Trend('get_users_duration');

const BASE_URL = 'https://quickpizza.grafana.com/api/users/token/login';
const USERNAME = 'default';
const PASSWORD = '12345678';

export const options = {
    vus: 2, // Number of virtual users
    duration: '10s', // Duration of the test
    thresholds: {
        http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
        http_req_failed: ['rate<0.5'], // Less than 1% of requests should fail
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

    let token;

    group('User Registration', function () {
        // Step 1: Send a POST request to the base URL
        const response = http.post(BASE_URL, JSON.stringify(registerPayload), {
            params: paramas
        });

        registrationDuration.add(response.timings.duration);
        token = response.json('token');

        check(response, {
            'is status 200': (r) => r.status === 200,
            'is token present': (r) => token !== undefined,
        });

    });


    group('Get Users', function () {
        // Step 2: Send a GET request to retrieve users
        const getUsersResponse = http.get('https://quickpizza.grafana.com/api/users', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }); 

        getUsersDuration.add(getUsersResponse.timings.duration);

        check(getUsersResponse, {
            'get users status is 200': (r) => r.status === 200,
        });

        if (getUsersResponse.status !== 200) {
            console.log('Get Users failed:', getUsersResponse.status, getUsersResponse.body);
        }
    });

}