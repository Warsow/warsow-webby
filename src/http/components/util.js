'use module';

export function trim(str) {
  return str
    .trim()
    .split('\n')
    .map((x) => x.trim())
    .join('\n');
}
