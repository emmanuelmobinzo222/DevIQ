// Mock data for the Ride Share application

export const mockUsers = [
  {
    id: '1',
    name: 'John Driver',
    email: 'john@example.com',
    role: 'driver',
    phone: '+1234567890',
    rating: 4.8,
    totalRides: 234,
    verified: true,
    carModel: 'Toyota Camry 2022',
    carPlate: 'ABC-1234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Sarah Rider',
    email: 'sarah@example.com',
    role: 'rider',
    phone: '+1234567891',
    rating: 4.9,
    totalRides: 156,
    verified: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  }
];

export const mockRides = [
  {
    id: 'ride-1',
    driverId: '1',
    driverName: 'John Driver',
    driverRating: 4.8,
    driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    carModel: 'Toyota Camry 2022',
    carPlate: 'ABC-1234',
    origin: { lat: 37.7749, lng: -122.4194, address: '123 Market St, San Francisco, CA' },
    destination: { lat: 37.8044, lng: -122.2712, address: '456 Broadway, Oakland, CA' },
    departureTime: new Date(Date.now() + 3600000).toISOString(),
    availableSeats: 3,
    totalSeats: 4,
    pricePerSeat: 15,
    status: 'available',
    passengers: [
      { id: '2', name: 'Sarah Rider', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' }
    ],
    distance: '12.5 miles',
    duration: '25 mins',
    splitEnabled: true
  },
  {
    id: 'ride-2',
    driverId: '3',
    driverName: 'Mike Transport',
    driverRating: 4.6,
    driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    carModel: 'Honda Accord 2021',
    carPlate: 'XYZ-5678',
    origin: { lat: 37.7849, lng: -122.4094, address: '789 Mission St, San Francisco, CA' },
    destination: { lat: 37.3382, lng: -121.8863, address: '321 Park Ave, San Jose, CA' },
    departureTime: new Date(Date.now() + 7200000).toISOString(),
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: 25,
    status: 'available',
    passengers: [
      { id: '4', name: 'Emma Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
      { id: '5', name: 'Tom Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom' }
    ],
    distance: '48 miles',
    duration: '55 mins',
    splitEnabled: true
  },
  {
    id: 'ride-3',
    driverId: '6',
    driverName: 'Lisa Davis',
    driverRating: 4.9,
    driverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    carModel: 'Tesla Model 3 2023',
    carPlate: 'TES-9999',
    origin: { lat: 37.7849, lng: -122.4194, address: '555 California St, San Francisco, CA' },
    destination: { lat: 37.8044, lng: -122.2712, address: '777 Telegraph Ave, Oakland, CA' },
    departureTime: new Date(Date.now() + 5400000).toISOString(),
    availableSeats: 4,
    totalSeats: 4,
    pricePerSeat: 18,
    status: 'available',
    passengers: [],
    distance: '14 miles',
    duration: '28 mins',
    splitEnabled: true
  }
];

export const mockRideHistory = [
  {
    id: 'history-1',
    date: '2025-01-15',
    origin: 'San Francisco Airport',
    destination: 'Downtown SF',
    fare: 35,
    splitWith: 2,
    finalCost: 17.5,
    status: 'completed',
    rating: 5
  },
  {
    id: 'history-2',
    date: '2025-01-10',
    origin: 'Home',
    destination: 'Office',
    fare: 20,
    splitWith: 1,
    finalCost: 20,
    status: 'completed',
    rating: 4
  }
];

export const getCurrentUser = () => {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const clearCurrentUser = () => {
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};
