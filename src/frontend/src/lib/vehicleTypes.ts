export const VEHICLE_TYPES = [
  { id: 'towTruck', icon: 0 },
  { id: 'truck', icon: 1 },
  { id: 'mobileCrane', icon: 2 },
  { id: 'forklift', icon: 3 },
  { id: 'grader', icon: 4 },
  { id: 'ambulance', icon: 5 },
  { id: 'other', icon: 6 },
];

export function getVehicleTypeIcon(id: string): string {
  return '/assets/generated/vehicle-icons-set.dim_512x512.png';
}
