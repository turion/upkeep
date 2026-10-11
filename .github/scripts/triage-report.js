const MAX_ATTEMPTS = 2;

const CLASSIFICATIONS = [
  'flaky',
  'simple mechanical',
  'complex or policy-sensitive',
  'external upstream breakage',
];

const KNOWN_SECTIONS = new Set([
  'classification',
  'evidence',
  'attempt count',
  'what was tried',
  'uncertainty',
  'recommended human action',
  'classical alternative considered',
]);

function parseSections(body) {
  const headings = [];
  const seenSections = new Set();
  let fence = null;
  let offset = 0;

  for (const line of body.split(/(?<=\n)/)) {
    const text = line.replace(/\r?\n$/, '');
    const marker = text.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.character &&
          marker[1].length >= fence.length && marker[2].trim() === '') {
        fence = null;
      }
      offset += line.length;
      continue;
    }
    if (marker) {
      fence = { character: marker[1][0], length: marker[1].length };
      offset += line.length;
      continue;
    }

    const heading = text.match(/^###\s+(.+?)\s*$/);
    const name = heading?.[1].trim().toLowerCase();
    if (name && KNOWN_SECTIONS.has(name) && !seenSections.has(name)) {
      headings.push({ index: offset, length: line.length, name });
      seenSections.add(name);
    }
    offset += line.length;
  }

  const sections = new Map();
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const contentStart = heading.index + heading.length;
    const contentEnd = headings[index + 1]?.index ?? body.length;
    sections.set(heading.name, body.slice(contentStart, contentEnd).trim());
  }
  return sections;
}

function fieldValue(sections, name) {
  const value = sections.get(name.toLowerCase()) || '';
  return /^_no response_$/i.test(value) ? '' : value;
}

function validateTriageReport(body) {
  const sections = parseSections(body);
  const classification = fieldValue(sections, 'Classification').toLowerCase();
  const evidence = fieldValue(sections, 'Evidence');
  const attemptCount = fieldValue(sections, 'Attempt count');
  const errors = [];

  if (!CLASSIFICATIONS.includes(classification)) {
    errors.push(`Classification must be one of: ${CLASSIFICATIONS.join(', ')}.`);
  }
  if (!evidence) {
    errors.push('Evidence is required.');
  }
  if (!/^(0|[1-9]\d*)$/.test(attemptCount) || Number(attemptCount) > MAX_ATTEMPTS) {
    errors.push(`Attempt count must be an integer from 0 through ${MAX_ATTEMPTS}.`);
  }

  return errors;
}

module.exports = { validateTriageReport };
