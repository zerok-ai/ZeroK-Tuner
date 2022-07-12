import http from 'k6/http';
import {check, sleep} from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

/* scenario specs */
const preallocVUs = 2000;
const maxVUs = 2000;
const timeUnit = '1s';

export let options = {
  noConnectionReuse: true,
  scenarios: {
    "hello": {
      executor: 'constant-arrival-rate',
      exec: 'helloWorld',
      preAllocatedVUs: preallocVUs,
      timeUnit,
      maxVUs,
      // rate: scenarioStages[scenarioName][0].target,
      // startRate: 500,
      // stages: [
      //   { duration: '1m', target:  25000 },
      // ], 
      duration: '10s',
      rate: 400,
    }
  },
  VUs: preallocVUs
}

export function helloWorld() {
  let res = http.get('http://localhost:8000/');
  check(res, { 'success login': (r) => r.status === 200 });
  sleep(0.3);
}

export function handleSummary(data) {
  return {
    "./status.json": JSON.stringify({
      "fails": data.root_group.checks[0].fails,
      "passes": data.root_group.checks[0].passes,
    }, null, 4),
    "./summary.json": JSON.stringify(data.metrics.http_req_duration.values, null, 4),
    "stdout": textSummary(data, { indent: ' ', enableColors: true })
  }
  // console.log(data.root_group.checks[0].fails)
  // console.log(data.metrics.http_req_duration.values)
  // console.log(data);
}