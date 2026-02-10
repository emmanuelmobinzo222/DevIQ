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

class BankAccount(BaseModel):
    accountHolder: str
    accountNumber: str
    bankName: str
    branchCode: str
    accountType: str  # 'Savings' or 'Current'
    swiftCode: Optional[str] = None

class ChildProfile(BaseModel):
    name: str
    age: int
    school: str
    idNumber: str
    photoUrl: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    role: str  # 'rider', 'driver', or 'parent'
    cardNumber: str
    cardExpiry: str
    cardCVV: str
    idNumber: str  # National ID number
    idPhotoUrl: Optional[str] = None  # Photo of ID
    selfieWithIdUrl: Optional[str] = None  # Selfie holding ID
    location: Optional[Location] = None
    bankAccount: Optional[BankAccount] = None  # Required for drivers
    children: Optional[List[ChildProfile]] = []

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
    bankAccount: Optional[BankAccount] = None
    children: Optional[List[ChildProfile]] = []
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
    rideType: str  # 'school_kids', 'private_1', 'shared_2', 'shared_3', 'shared_4', 'shared_5plus', 'split_cost'
    availableSeats: int
    totalSeats: int
    pricePerSeat: float
    currency: str  # 'ZAR', 'USD', 'EUR', etc.
    carModel: str
    carPlate: str
    distance: Optional[str] = None
    duration: Optional[str] = None
    isSchoolRide: bool = False
    schoolName: Optional[str] = None

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
    rideType: str
    availableSeats: int
    totalSeats: int
    pricePerSeat: float
    currency: str
    status: str
    passengers: List[PassengerInfo]
    distance: Optional[str] = None
    duration: Optional[str] = None
    splitEnabled: bool = True
    isSchoolRide: bool = False
    schoolName: Optional[str] = None
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
