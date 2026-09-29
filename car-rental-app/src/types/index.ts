export type VehicleStatus = 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'MAINTENANCE';

export type VehicleCategory = 'ECO' | 'SEDAN' | 'SUV' | 'EV' | 'VAN';

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: VehicleCategory;
  licensePlate: string;
  seats: number;
  doors: number;
  transmission: 'AUTO' | 'MANUAL';
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  dailyRate: number; // Baht
  deposit: number; // Baht (BR-06)
  imageUrl: string;
  branch: string;
  status: VehicleStatus;
  currentMileage: number;
  fuelLevelPercent: number;
  features: string[];
}

export type BookingStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  bookingRef: string; // e.g. BK-202610-8F9A
  vehicleId: string;
  vehicle?: Vehicle;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  idCardOrPassport: string;
  licenseNumber: string;
  pickupBranch: string;
  returnBranch: string;
  pickupDate: string; // YYYY-MM-DD
  returnDate: string;  // YYYY-MM-DD
  days: number;
  dailyRate: number;
  rentalTotal: number;
  insuranceFee: number;
  vatAmount: number;
  depositAmount: number;
  grandTotal: number;
  status: BookingStatus;
  createdAt: string;
  paidAt?: string;
  paymentMethod?: 'PROMPTPAY' | 'CREDIT_CARD';
}

export interface InspectionRecord {
  id: string;
  bookingRef: string;
  vehicleId: string;
  type: 'CHECKOUT' | 'CHECKIN';
  staffName: string;
  mileage: number;
  fuelLevelPercent: number;
  cleanliness: 'CLEAN' | 'NORMAL' | 'DIRTY';
  damagesReported: string[];
  photoUrls: string[];
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  activeBookingsCount: number;
  availableVehiclesCount: number;
  totalVehiclesCount: number;
  occupancyRate: number;
}
