/**
 * Cliente de comunicación HTTP con la API REST N-Layers (.NET 9)
 */

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export const api = {
  // Vehículos
  async getVehicles() {
    const res = await fetch(`${API_BASE_URL}/vehicles`);
    return (await res.json()) as ApiResponse<any[]>;
  },

  async getVehicle(id: string) {
    const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
    return (await res.json()) as ApiResponse<any>;
  },

  async createVehicle(payload: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return (await res.json()) as ApiResponse<any>;
    } catch (err) {
      console.warn('API backend offline, operando en almacenamiento local.');
      return null;
    }
  },

  async getDashboardSummary(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/dashboard`);
    return (await res.json()) as ApiResponse<any>;
  },

  // Combustible
  async getFuelLogs(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/fuel/vehicle/${vehicleId}`);
    return (await res.json()) as ApiResponse<any[]>;
  },

  async createFuelLog(payload: any) {
    const res = await fetch(`${API_BASE_URL}/fuel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return (await res.json()) as ApiResponse<any>;
  },

  async getFuelMatrix(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/fuel/matrix/${vehicleId}`);
    return (await res.json()) as ApiResponse<any[]>;
  },

  // Services
  async getServices(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/services/vehicle/${vehicleId}`);
    return (await res.json()) as ApiResponse<any[]>;
  },

  async performService(serviceId: string, payload: any) {
    const res = await fetch(`${API_BASE_URL}/services/${serviceId}/perform`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return (await res.json()) as ApiResponse<any>;
  },

  async getServiceLogs(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/services/logs/${vehicleId}`);
    return (await res.json()) as ApiResponse<any[]>;
  },

  // Telemetría
  async getTelemetry(vehicleId: string) {
    const res = await fetch(`${API_BASE_URL}/telemetry/${vehicleId}`);
    return (await res.json()) as ApiResponse<any>;
  },

  async simulateTelemetry(vehicleId: string, distanceKm: number) {
    const res = await fetch(`${API_BASE_URL}/telemetry/${vehicleId}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ distanceKm })
    });
    return (await res.json()) as ApiResponse<any>;
  },

  async calibrateTelemetry(vehicleId: string, dashboardOdometer: number) {
    const res = await fetch(`${API_BASE_URL}/telemetry/${vehicleId}/calibrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dashboardOdometer })
    });
    return (await res.json()) as ApiResponse<any>;
  }
};
