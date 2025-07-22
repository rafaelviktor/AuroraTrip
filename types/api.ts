// Define a estrutura dos dados que vêm da sua API

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
  // Futuramente, você pode adicionar um campo como 'imageUrl' aqui
}

// Novo tipo para os dados da carteira
export interface Wallet {
  _id: string;
  owner: string;
  ownerType: 'User' | 'Driver';
  balance: number;
  createdAt: string;
  updatedAt: string;
}

// Novo tipo para uma única transação
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

// Novo tipo para a resposta da API de transações
export interface TransactionsApiResponse {
  data: Transaction[];
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
}