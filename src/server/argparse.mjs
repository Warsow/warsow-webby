export function getEnv(name) {
  const strValue = process.env[name];
  if (!strValue) {
    return;
  }
  const intValue = parseInt(strValue, 10);
  if (!Number.isNaN(intValue)) {
    return intValue;
  }
  return strValue;
}

export function getBoolArgument(name, valueIfTrue = true, valueIfFalse = false) {
  return process.argv.includes(name) ? valueIfTrue : valueIfFalse;
}
