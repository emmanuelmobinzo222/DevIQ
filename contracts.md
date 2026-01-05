# RideShare Application - Backend Integration Contracts

## API Contracts

### Authentication Endpoints

#### POST /api/auth/signup
- **Request**: `{ name, email, password, phone, role }`
- **Response**: `{ user: { id, name, email, role, phone, rating, totalRides, verified, avatar }, token }`
- **Mock**: Currently using localStorage for user data

#### POST /api/auth/login
- **Request**: `{ email, password }`
- **Response**: `{ user: {...}, token }`
- **Mock**: Currently using localStorage

#### GET /api/auth/me
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ user: {...} }`

### Rides Endpoints

#### GET /api/rides
- **Query Params**: `origin?, destination?, date?`
- **Response**: `{ rides: [...] }`
- **Mock**: mockRides array in mockData.js

#### GET /api/rides/:id
- **Response**: `{ ride: {...} }`
- **Mock**: mockRides.find(r => r.id === id)

#### POST /api/rides (Driver only)
- **Request**: `{ origin, destination, departureTime, availableSeats, pricePerSeat, carModel, carPlate }`
- **Response**: `{ ride: {...} }`
- **Mock**: Currently shows toast and redirects

#### POST /api/rides/:id/book
- **Request**: `{ seats, splitFare }`
- **Response**: `{ booking: { rideId, userId, seats, cost, splitFare }, ride: {...updated} }`
- **Mock**: Currently shows toast and redirects

### User Endpoints

#### GET /api/users/:id
- **Response**: `{ user: {...} }`

#### PUT /api/users/:id
- **Request**: `{ name?, phone?, carModel?, carPlate? }`
- **Response**: `{ user: {...updated} }`
- **Mock**: setCurrentUser in localStorage

#### GET /api/users/:id/history
- **Response**: `{ history: [...] }`
- **Mock**: mockRideHistory array

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  role: String (enum: 'rider', 'driver'),
  rating: Number (default: 5.0),
  totalRides: Number (default: 0),
  verified: Boolean (default: true),
  avatar: String,
  carModel: String (optional, for drivers),
  carPlate: String (optional, for drivers),
  createdAt: Date,
  updatedAt: Date
}
```

### Ride Model
```javascript
{
  _id: ObjectId,
  driverId: ObjectId (ref: User),
  origin: {
    lat: Number,
    lng: Number,
    address: String
  },
  destination: {
    lat: Number,
    lng: Number,
    address: String
  },
  departureTime: Date,
  availableSeats: Number,
  totalSeats: Number,
  pricePerSeat: Number,
  status: String (enum: 'available', 'in_progress', 'completed', 'cancelled'),
  distance: String,
  duration: String,
  splitEnabled: Boolean (default: true),
  carModel: String,
  carPlate: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  _id: ObjectId,
  rideId: ObjectId (ref: Ride),
  userId: ObjectId (ref: User),
  seats: Number,
  cost: Number,
  splitFare: Boolean,
  status: String (enum: 'pending', 'confirmed', 'completed', 'cancelled'),
  rating: Number (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## Mock Data to Backend Migration

### From mockData.js:
1. **mockUsers** → User collection
2. **mockRides** → Ride collection
3. **mockRideHistory** → Booking collection

### Frontend Changes Required:

1. **Auth.jsx**: 
   - Replace mock authentication with API calls to /api/auth/signup and /api/auth/login
   - Store JWT token in localStorage
   - Remove setCurrentUser mock calls

2. **Dashboard.jsx**:
   - Replace getCurrentUser() with API call to /api/auth/me
   - Replace mockRides with API call to /api/rides
   - Replace mockRideHistory with API call to /api/users/:id/history

3. **Rides.jsx**:
   - Replace mockRides with API call to /api/rides with search params

4. **RideDetail.jsx**:
   - Replace mockRides.find() with API call to /api/rides/:id
   - Replace mock booking with API call to /api/rides/:id/book

5. **CreateRide.jsx**:
   - Replace mock ride creation with API call to POST /api/rides

6. **Profile.jsx**:
   - Replace setCurrentUser with API call to PUT /api/users/:id

7. **History.jsx**:
   - Replace mockRideHistory with API call to /api/users/:id/history

## Backend Implementation Steps

1. **Setup** (DONE):
   - FastAPI server with CORS
   - MongoDB connection
   - Basic API structure with /api prefix

2. **Authentication**:
   - JWT token generation and validation
   - Password hashing with bcrypt
   - Auth middleware for protected routes

3. **Models**:
   - User model with validation
   - Ride model with geolocation
   - Booking model with references

4. **Endpoints**:
   - Implement all CRUD operations
   - Add search/filter functionality
   - Add booking logic with fare calculation

5. **Business Logic**:
   - Fare splitting calculation
   - Available seats management
   - Rating system
   - Ride status transitions

6. **Integration**:
   - Update frontend axios calls
   - Replace all mock data with API calls
   - Add error handling
   - Add loading states
