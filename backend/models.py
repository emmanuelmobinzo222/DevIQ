from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# User Models
class Location(BaseModel):
    lat: float
    lng: float
    country: str
    city: Optional[str] = None
    address: Optional[str] = None

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str  # 'rider' or 'driver'
    cardNumber: str
    cardExpiry: str
    cardCVV: str
    location: Optional[Location] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    role: str
    rating: float
    totalRides: int
    verified: bool
    cardVerified: bool
    idVerified: bool
    location: Optional[Location] = None
    avatar: str
    carModel: Optional[str] = None
    carPlate: Optional[str] = None
    createdAt: datetime

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    carModel: Optional[str] = None
    carPlate: Optional[str] = None

# Ride Models
class RideLocation(BaseModel):
    lat: float
    lng: float
    address: str

class RideCreate(BaseModel):
    origin: RideLocation
    destination: RideLocation
    departureTime: str
    availableSeats: int
    totalSeats: int
    pricePerSeat: float
    carModel: str
    carPlate: str
    distance: Optional[str] = None
    duration: Optional[str] = None

class PassengerInfo(BaseModel):
    id: str
    name: str
    avatar: str

class RideResponse(BaseModel):
    id: str
    driverId: str
    driverName: str
    driverRating: float
    driverAvatar: str
    carModel: str
    carPlate: str
    origin: RideLocation
    destination: RideLocation
    departureTime: str
    availableSeats: int
    totalSeats: int
    pricePerSeat: float
    status: str
    passengers: List[PassengerInfo]
    distance: Optional[str] = None
    duration: Optional[str] = None
    splitEnabled: bool = True
    createdAt: datetime

# Booking Models
class BookingCreate(BaseModel):
    seats: int
    splitFare: bool

class BookingResponse(BaseModel):
    id: str
    rideId: str
    userId: str
    seats: int
    cost: float
    splitFare: bool
    status: str
    createdAt: datetime

class RideHistory(BaseModel):
    id: str
    date: str
    origin: str
    destination: str
    fare: float
    splitWith: int
    finalCost: float
    status: str
    rating: Optional[int] = None
