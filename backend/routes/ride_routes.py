from fastapi import APIRouter, HTTPException, Depends, Query
from models import RideCreate, RideResponse, PassengerInfo
from dependencies import get_current_user, get_current_driver
from datetime import datetime
from typing import Optional, List
import uuid

router = APIRouter(prefix="/rides", tags=["rides"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[RideResponse])
async def get_rides(
    origin: Optional[str] = Query(None),
    destination: Optional[str] = Query(None),
    date: Optional[str] = Query(None)
):
    db = await get_db()
    # Build query
    query = {"status": "available", "availableSeats": {"$gt": 0}}
    
    if origin:
        query["origin.address"] = {"$regex": origin, "$options": "i"}
    
    if destination:
        query["destination.address"] = {"$regex": destination, "$options": "i"}
    
    # Get rides
    rides_cursor = db.rides.find(query).sort("departureTime", 1)
    rides = await rides_cursor.to_list(length=100)
    
    # Get driver info and bookings for each ride
    result = []
    for ride in rides:
        driver = await db.users.find_one({"_id": ride["driverId"]})
        if not driver:
            continue
        
        # Get passengers for this ride
        bookings = await db.bookings.find({
            "rideId": ride["_id"],
            "status": "confirmed"
        }).to_list(length=100)
        
        passengers = []
        for booking in bookings:
            passenger = await db.users.find_one({"_id": booking["userId"]})
            if passenger:
                passengers.append(PassengerInfo(
                    id=passenger["_id"],
                    name=passenger["name"],
                    avatar=passenger["avatar"]
                ))
        
        ride_response = RideResponse(
            id=ride["_id"],
            driverId=ride["driverId"],
            driverName=driver["name"],
            driverRating=driver["rating"],
            driverAvatar=driver["avatar"],
            carModel=ride["carModel"],
            carPlate=ride["carPlate"],
            origin=ride["origin"],
            destination=ride["destination"],
            departureTime=ride["departureTime"],
            rideType=ride.get("rideType", "shared_3"),
            availableSeats=ride["availableSeats"],
            totalSeats=ride["totalSeats"],
            pricePerSeat=ride["pricePerSeat"],
            currency=ride.get("currency", "ZAR"),
            status=ride["status"],
            passengers=passengers,
            distance=ride.get("distance", "N/A"),
            duration=ride.get("duration", "N/A"),
            splitEnabled=ride.get("splitEnabled", True),
            isSchoolRide=ride.get("isSchoolRide", False),
            schoolName=ride.get("schoolName"),
            createdAt=ride["createdAt"]
        )
        result.append(ride_response)
    
    return result

@router.get("/{ride_id}", response_model=RideResponse)
async def get_ride(ride_id: str):
    db = await get_db()
    ride = await db.rides.find_one({"_id": ride_id})
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    driver = await db.users.find_one({"_id": ride["driverId"]})
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Get passengers
    bookings = await db.bookings.find({
        "rideId": ride_id,
        "status": "confirmed"
    }).to_list(length=100)
    
    passengers = []
    for booking in bookings:
        passenger = await db.users.find_one({"_id": booking["userId"]})
        if passenger:
            passengers.append(PassengerInfo(
                id=passenger["_id"],
                name=passenger["name"],
                avatar=passenger["avatar"]
            ))
    
    ride_response = RideResponse(
        id=ride["_id"],
        driverId=ride["driverId"],
        driverName=driver["name"],
        driverRating=driver["rating"],
        driverAvatar=driver["avatar"],
        carModel=ride["carModel"],
        carPlate=ride["carPlate"],
        origin=ride["origin"],
        destination=ride["destination"],
        departureTime=ride["departureTime"],
        rideType=ride.get("rideType", "shared_3"),
        availableSeats=ride["availableSeats"],
        totalSeats=ride["totalSeats"],
        pricePerSeat=ride["pricePerSeat"],
        currency=ride.get("currency", "ZAR"),
        status=ride["status"],
        passengers=passengers,
        distance=ride.get("distance", "N/A"),
        duration=ride.get("duration", "N/A"),
        splitEnabled=ride.get("splitEnabled", True),
        isSchoolRide=ride.get("isSchoolRide", False),
        schoolName=ride.get("schoolName"),
        createdAt=ride["createdAt"]
    )
    
    return ride_response

@router.post("", response_model=RideResponse)
async def create_ride(
    ride_data: RideCreate,
    driver = Depends(get_current_driver)
):
    from dependencies import get_current_driver
    db = await get_db()
    
    # Create ride document
    ride_id = str(uuid.uuid4())
    ride_doc = {
        "_id": ride_id,
        "driverId": driver["_id"],
        "origin": ride_data.origin.dict(),
        "destination": ride_data.destination.dict(),
        "departureTime": ride_data.departureTime,
        "rideType": ride_data.rideType,
        "availableSeats": ride_data.availableSeats,
        "totalSeats": ride_data.totalSeats,
        "pricePerSeat": ride_data.pricePerSeat,
        "currency": ride_data.currency,
        "carModel": ride_data.carModel,
        "carPlate": ride_data.carPlate,
        "status": "available",
        "distance": ride_data.distance or "N/A",
        "duration": ride_data.duration or "N/A",
        "splitEnabled": True,
        "isSchoolRide": ride_data.isSchoolRide,
        "schoolName": ride_data.schoolName,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.rides.insert_one(ride_doc)
    
    # Return ride response
    ride_response = RideResponse(
        id=ride_id,
        driverId=driver["_id"],
        driverName=driver["name"],
        driverRating=driver["rating"],
        driverAvatar=driver["avatar"],
        carModel=ride_data.carModel,
        carPlate=ride_data.carPlate,
        origin=ride_data.origin,
        destination=ride_data.destination,
        departureTime=ride_data.departureTime,
        availableSeats=ride_data.availableSeats,
        totalSeats=ride_data.totalSeats,
        pricePerSeat=ride_data.pricePerSeat,
        status="available",
        passengers=[],
        distance=ride_doc["distance"],
        duration=ride_doc["duration"],
        splitEnabled=True,
        createdAt=ride_doc["createdAt"]
    )
    
    return ride_response
