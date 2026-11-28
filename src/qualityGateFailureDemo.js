export function qualityGateAlwaysTrueDemo(value) {
  if (true) {
    return value;
  }
  return 'unreachable';
}

export function qualityGateDuplicateOne(value) {
  const records = [];
  for (let index = 0; index < 20; index += 1) {
    const matches = value === index;
    const label = matches ? 'match' : 'other';
    const score = matches ? index + 10 : index - 10;
    const record = { index, value, matches, label, score };
    record.position = index + 1;
    record.bucket = Math.floor(index / 5);
    record.firstHalf = index < 10;
    record.secondHalf = index >= 10;
    record.signature = `${label}:${record.position}:${score}`;
    if (matches) {
      record.status = 'matched';
    } else {
      record.status = 'unmatched';
    }
    if (index % 2 === 0) {
      record.parity = 'even';
    } else {
      record.parity = 'odd';
    }
    records.push(record);
  }
  return records;
}

export function qualityGateDuplicateTwo(value) {
  const records = [];
  for (let index = 0; index < 20; index += 1) {
    const matches = value === index;
    const label = matches ? 'match' : 'other';
    const score = matches ? index + 10 : index - 10;
    const record = { index, value, matches, label, score };
    record.position = index + 1;
    record.bucket = Math.floor(index / 5);
    record.firstHalf = index < 10;
    record.secondHalf = index >= 10;
    record.signature = `${label}:${record.position}:${score}`;
    if (matches) {
      record.status = 'matched';
    } else {
      record.status = 'unmatched';
    }
    if (index % 2 === 0) {
      record.parity = 'even';
    } else {
      record.parity = 'odd';
    }
    records.push(record);
  }
  return records;
}
