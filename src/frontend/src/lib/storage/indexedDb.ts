import type { VisitorRecord, VehicleRecord } from './types';

const DB_NAME = 'athena-surveillance';
const DB_VERSION = 1;
const VISITOR_STORE = 'visitors';
const VEHICLE_STORE = 'vehicles';

let dbInstance: IDBDatabase | null = null;

function openDatabase(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(VISITOR_STORE)) {
        const visitorStore = db.createObjectStore(VISITOR_STORE, { keyPath: 'id', autoIncrement: true });
        visitorStore.createIndex('timestamp', 'timestamp', { unique: false });
        visitorStore.createIndex('accessPoint', 'accessPoint', { unique: false });
      }

      if (!db.objectStoreNames.contains(VEHICLE_STORE)) {
        const vehicleStore = db.createObjectStore(VEHICLE_STORE, { keyPath: 'id', autoIncrement: true });
        vehicleStore.createIndex('timestamp', 'timestamp', { unique: false });
        vehicleStore.createIndex('accessPoint', 'accessPoint', { unique: false });
      }
    };
  });
}

export async function saveVisitorRecord(record: VisitorRecord): Promise<number> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VISITOR_STORE], 'readwrite');
    const store = transaction.objectStore(VISITOR_STORE);
    const request = store.add(record);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function saveVehicleRecord(record: VehicleRecord): Promise<number> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLE_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLE_STORE);
    const request = store.add(record);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllVisitorRecords(): Promise<VisitorRecord[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VISITOR_STORE], 'readonly');
    const store = transaction.objectStore(VISITOR_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllVehicleRecords(): Promise<VehicleRecord[]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLE_STORE], 'readonly');
    const store = transaction.objectStore(VEHICLE_STORE);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updateVisitorExitTime(id: number, exitTime: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VISITOR_STORE], 'readwrite');
    const store = transaction.objectStore(VISITOR_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (record) {
        record.exitTime = exitTime;
        const updateRequest = store.put(record);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Record not found'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

export async function updateVehicleExitTime(id: number, exitTime: string): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VEHICLE_STORE], 'readwrite');
    const store = transaction.objectStore(VEHICLE_STORE);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const record = getRequest.result;
      if (record) {
        record.exitTime = exitTime;
        const updateRequest = store.put(record);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error('Record not found'));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}
