const assert = require('node:assert/strict');
const test = require('node:test');

const { validateTriageReport } = require('./triage-report.js');

function report({ classification = 'Simple mechanical', evidence = 'CI log excerpt', attempts = '1' } = {}) {
  return [
    '### Classification',
    classification,
    '### Evidence',
    evidence,
    '### Attempt count',
    attempts,
  ].join('\n');
}

test('accepts each classification and attempt-count boundary', () => {
  for (const classification of [
    'Flaky',
    'Simple mechanical',
    'Complex or policy-sensitive',
    'External upstream breakage',
  ]) {
    for (const attempts of ['0', '1', '2']) {
      assert.deepEqual(validateTriageReport(report({ classification, attempts })), []);
    }
  }
});

test('rejects unsupported classifications and malformed attempt counts', () => {
  for (const attempts of ['3', '001', '-1', '']) {
    const errors = validateTriageReport(report({ classification: 'Unknown', attempts }));
    assert.match(errors[0], /Classification must be one of: flaky, simple mechanical/);
    assert.match(errors[1], /integer from 0 through 2/);
  }
});

test('accepts CRLF reports and headings inside fenced evidence', () => {
  const body = [
    '### Classification',
    'Simple mechanical',
    '### Evidence',
    'Relevant CI output:',
    '```text',
    '### Attempt count',
    '999',
    '### An unrelated heading',
    '```',
    '### Attempt count',
    '2',
  ].join('\r\n');
  assert.deepEqual(validateTriageReport(body), []);
});

test('keeps the first recognized occurrence of a section', () => {
  const body = [
    '### Classification',
    'Simple mechanical',
    '### Evidence',
    'First evidence',
    '### Evidence',
    '_No response_',
    '### Attempt count',
    '1',
  ].join('\n');
  assert.deepEqual(validateTriageReport(body), []);
});

test('rejects empty evidence and the issue form empty-response placeholder', () => {
  for (const evidence of ['', '_No response_']) {
    assert.ok(validateTriageReport(report({ evidence })).includes('Evidence is required.'));
  }
});

test('rejects empty bodies and missing required sections', () => {
  const errors = validateTriageReport('');
  assert.equal(errors.length, 3);
  assert.match(errors[0], /Classification must be one of:/);
  assert.equal(errors[1], 'Evidence is required.');
  assert.match(errors[2], /Attempt count must be an integer/);
});
