import http from 'k6/http';
import {check, sleep} from 'k6';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

export let options = {
  VUs: 200,
  duration: '10s'
}

export default function() {
  let res = http.get('http://localhost:3000/highmem?count=15');
  // let res = http.get('http://localhost:3000/highcpu?count=333000');
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