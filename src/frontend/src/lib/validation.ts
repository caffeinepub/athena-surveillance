export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateTime(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

export function validateExitTime(entryTime: string, exitTime: string): boolean {
  if (!entryTime || !exitTime) return true;
  
  const [entryHour, entryMinute] = entryTime.split(':').map(Number);
  const [exitHour, exitMinute] = exitTime.split(':').map(Number);
  
  const entryMinutes = entryHour * 60 + entryMinute;
  const exitMinutes = exitHour * 60 + exitMinute;
  
  return exitMinutes >= entryMinutes;
}
