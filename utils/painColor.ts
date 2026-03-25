const PAIN_COLORS = {
  low: [34, 197, 94] as const,
  mid: [234, 179, 8] as const,
  high: [239, 68, 68] as const,
};

export function getPainColorRGB(level: number): readonly [number, number, number] {
  if (level <= 3) return PAIN_COLORS.low;
  if (level <= 6) return PAIN_COLORS.mid;
  return PAIN_COLORS.high;
}

export function getPainColorHex(level: number): string {
  if (level <= 3) return '#22c55e';
  if (level <= 6) return '#eab308';
  return '#ef4444';
}
