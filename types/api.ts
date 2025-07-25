export interface TouristPoint {
  _id: string;
  name: string;
  city: string;
  state: string;
}

export interface Vehicle {
  _id: string;
  type: string;
  vehicleModel: string;
  capacity: number;
  driver: string;
}

export interface Driver {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  transportType: 'buggy' | 'lancha' | '4x4';
  role: 'driver';
  vehicles: Vehicle[]; // Adiciona a lista de veículos
  createdAt: string;
}

export interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  phone: string;
  role: 'user';
  createdAt: string;
}

export type ProfileData = User | Driver;

export interface PackageTour {
  _id: string;
  driver: Driver;
  vehicle: Vehicle;
  origin: TouristPoint;
  destination: TouristPoint;
  departureTime: string;
  returnTime: string;
  price: number;
  seatsAvailable: number;
  tourType: string;
  // Futuramente, pode adicionar um campo como 'imageUrl'
}

// Carteira
export interface Wallet {
  _id: string;
  owner: string;
  ownerType: 'User' | 'Driver';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// Transação
export interface Transaction {
  _id: string;
  walletId: string;
  amount: number;
  type: string;
  status: string;
  metadata?: {
    description?: string;
    [key: string]: any; // Permite outras propriedades nos metadados
  };
  createdAt: string;
}

// Transações
export interface TransactionsApiResponse {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
}

// Reserva
export interface Booking {
  _id: string;
  packageTour: {
    _id: string;
    departureTime: string;
    tourType: string;
  };
  driver: {
    _id: string;
    name: string;
  };
  seats: number;
  totalPrice: number;
  status: 'pending_payment' | 'confirmed' | 'in_progress' | 'completed' | 'canceled_by_user' | 'canceled_by_driver';
  createdAt: string;
}