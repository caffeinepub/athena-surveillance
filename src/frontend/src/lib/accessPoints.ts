export const ACCESS_POINTS = [
  { id: 'ACP1', icon: 0 },
  { id: 'ACP2', icon: 1 },
  { id: 'ACP3', icon: 2 },
  { id: 'ACP4', icon: 3 },
  { id: 'ACP5', icon: 4 },
  { id: 'ACP6', icon: 5 },
];

export function getAccessPointIcon(id: string): string {
  return '/assets/generated/acp-icons-set.dim_512x512.png';
}
