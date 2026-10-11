const MAX_ATTEMPTS = 2;

const TRANSIENT_PATTERNS = [
  /Truncated tar archive/i,
  /cannot read file from tarball/i,
  /Could not resolve host/i,
  /ECONNRESET|ETIMEDOUT|ECONNREFUSED/,
  /The runner has received a shutdown signal/i,
  /lost communication with the server/i,
  /HTTP (?:error )?(?:502|503|504)\b/i,
  /unable to download .* (?:timed out|Connection (?:reset|timed out))/i,
  /No space left on device/i,
];

const ANSI = /\u001b\[[0-9;]*m/g;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T[\d:.]+Z /;

function cleanLines(log) {
  return log.split(/\r?\n/).map((line) => line.replace(TIMESTAMP, '').replace(ANSI, ''));
}

// Names of the form `/nix/store/<hash>-<name>.drv`, without hash and suffix.
function derivationName(path) {
  return path.replace(/^.*\/[0-9a-z]{32}-/, '').replace(/\.drv$/, '');
}

// Finds the first real error. Nix reports "Reason: N dependency failed"
// for every downstream derivation; those and the alls-green gate are noise.
function extractRootCause(log) {
  const lines = cleanLines(log);
  for (let i = 0; i < lines.length; i += 1) {
    const build = lines[i].match(/error: Cannot build '([^']+\.drv)'/);
    if (!build) continue;
    const reason = (lines[i + 1] || '').match(/Reason: (.*)$/);
    if (reason && /dependenc(?:y|ies) failed/.test(reason[1])) continue;
    const excerpt = lines.slice(i, i + 2).map((line) => line.trim());
    return {
      kind: 'nix-build',
      subject: derivationName(build[1]),
      reason: reason ? reason[1].trim() : null,
      excerpt,
    };
  }
  for (const line of lines) {
    const hit = TRANSIENT_PATTERNS.find((pattern) => pattern.test(line));
    if (hit) {
      return { kind: 'transient', subject: null, reason: null, excerpt: [line.trim()] };
    }
  }
  const generic = lines.find((line) => /##\[error\]/.test(line) && !/Process completed with exit code/.test(line));
  if (generic) {
    return { kind: 'unknown', subject: null, reason: null, excerpt: [generic.trim()] };
  }
  return { kind: 'unknown', subject: null, reason: null, excerpt: [] };
}

function isTransient(log) {
  return cleanLines(log).some((line) => TRANSIENT_PATTERNS.some((pattern) => pattern.test(line)));
}

// A retry needs evidence of a transient cause, must not exceed the attempt
// limit of the escalation contract, and must not be a failure that is
// identical across every failed job (that points at a deterministic cause).
function shouldRetry({ runAttempt, jobLogs }) {
  if (runAttempt >= MAX_ATTEMPTS) {
    return { retry: false, reason: 'attempt limit reached' };
  }
  const transient = jobLogs.filter(isTransient);
  if (transient.length === 0) {
    return { retry: false, reason: 'no transient evidence' };
  }
  if (transient.length < jobLogs.length) {
    return { retry: false, reason: 'some failed jobs show non-transient errors' };
  }
  return { retry: true, reason: 'all failed jobs show transient errors' };
}

function selectRepos(repos, { optOut = [], owner } = {}) {
  const excluded = new Set(optOut.map((name) => name.toLowerCase()));
  return repos
    .filter((repo) => !repo.archived && !repo.fork && !repo.disabled)
    .filter((repo) => !owner || repo.owner.login.toLowerCase() === owner.toLowerCase())
    .filter((repo) => !excluded.has(repo.name.toLowerCase()) && !excluded.has(repo.full_name.toLowerCase()))
    .map((repo) => repo.full_name);
}

module.exports = {
  MAX_ATTEMPTS,
  extractRootCause,
  isTransient,
  selectRepos,
  shouldRetry,
};
