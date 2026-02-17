export interface VisitorRecord {
  id?: number;
  visitorName: string;
  personVisited: string;
  cinNumber: string;
  vehiclePlate: string;
  company: string;
  entryTime: string;
  exitTime: string;
  destination: string;
  observations: string;
  announced: string;
  supervisorName: string;
  accessPoint: string;
  recordDate: string;
  timestamp: string;
}

export interface VehicleRecord {
  id?: number;
  vehicleType: string;
  driverName: string;
  plate: string;
  company: string;
  voucherNumber: string;
  entryTime: string;
  exitTime: string;
  destination: string;
  observations: string;
  supervisorName: string;
  accessPoint: string;
  recordDate: string;
  timestamp: string;
}
