const inception = Date.now();

function getTimestamp() {
  const timestamp = String(Date.now() - inception)
    .padStart(4, '0')
    .padStart(7, ' ');
  const seconds = timestamp.substr(0, timestamp.length - 3);
  const millis = timestamp.substr(-3);
  return `${seconds}.${millis}`;
}

const ESC = {
  dimmed: "\x1b[38;5;240m",
  bright: "\x1b[37;1m",
  reset: "\x1b[0m",
}

function getPrefix(ns) {
  return `${ESC.dimmed}${getTimestamp()} ${ESC.bright}${ns}${ESC.reset}`;
}

export function createLogger(ns) {
  return {
    log(...args) {
      console.log(getPrefix(ns), ...args);
    },
    error(...args) {
      console.error(getPrefix(ns), ...args);
    },
    warn(...args) {
      console.warn(getPrefix(ns), ...args);
    },
    debug(...args) {
      console.debug(getPrefix(ns), ...args);
    },
  }
}
