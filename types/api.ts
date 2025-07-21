// Define a estrutura dos dados que vêm da sua API

export interface TouristPoint {
  _id: string;
  name: string;
  city: string;
  state: string;
}

export interface Vehicle {
  _id: string;
  vehicleModel: string;
  capacity: number;
}

export interface Driver {
  _id: string;
  name: string;
  transportType: 'buggy' | 'lancha' | '4x4';
}

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