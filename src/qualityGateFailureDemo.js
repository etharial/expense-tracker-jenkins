export function qualityGateAlwaysTrueDemo(value) {
  if (true) {
    return value;
  }
  return 'unreachable';
}
