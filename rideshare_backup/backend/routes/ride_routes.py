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
    
    # Get rides with projection and limit at database level
    projection = {
        '_id': 1, 'driverId': 1, 'origin': 1, 'destination': 1, 
        'departureTime': 1, 'availableSeats': 1, 'totalSeats': 1, 
        'pricePerSeat': 1, 'carModel': 1, 'carPlate': 1, 'status': 1,
        'currency': 1, 'distance': 1, 'duration': 1, 'rideType': 1,
        'splitEnabled': 1, 'isSchoolRide': 1, 'schoolName': 1, 'createdAt': 1
    }
    
    rides = await db.rides.find(query, projection).sort("departureTime", 1).limit(100).to_list(length=None)
    
    if not rides:
        return []
    
    # Batch fetch all drivers
    driver_ids = list(set(ride["driverId"] for ride in rides))
    drivers_cursor = db.users.find(
        {"_id": {"$in": driver_ids}},
        {"_id": 1, "name": 1, "rating": 1, "avatar": 1}
    )
    drivers = await drivers_cursor.to_list(length=None)
    drivers_dict = {driver["_id"]: driver for driver in drivers}
    
    # Batch fetch all bookings for these rides
    ride_ids = [ride["_id"] for ride in rides]
    bookings = await db.bookings.find(
        {"rideId": {"$in": ride_ids}, "status": "confirmed"}
    ).to_list(length=None)
    
    # Group bookings by ride
    bookings_by_ride = {}
    for booking in bookings:
        ride_id = booking["rideId"]
        if ride_id not in bookings_by_ride:
            bookings_by_ride[ride_id] = []
        bookings_by_ride[ride_id].append(booking)
    
    # Batch fetch all passengers
    user_ids = list(set(booking["userId"] for booking in bookings))
    if user_ids:
        passengers_cursor = db.users.find(
            {"_id": {"$in": user_ids}},
            {"_id": 1, "name": 1, "avatar": 1}
        )
        passengers = await passengers_cursor.to_list(length=None)
        passengers_dict = {passenger["_id"]: passenger for passenger in passengers}
    else:
        passengers_dict = {}
    
    # Build response
    result = []
    for ride in rides:
        driver = drivers_dict.get(ride["driverId"])
        if not driver:
            continue
        
        # Get passengers for this ride
        ride_bookings = bookings_by_ride.get(ride["_id"], [])
        passengers_list = []
        for booking in ride_bookings:
            passenger = passengers_dict.get(booking["userId"])
            if passenger:
                passengers_list.append(PassengerInfo(
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
            rideType=ride.get("rideType", "split_cost"),
            availableSeats=ride["availableSeats"],
            totalSeats=ride["totalSeats"],
            pricePerSeat=ride["pricePerSeat"],
            currency=ride.get("currency", "ZAR"),
            status=ride["status"],
            passengers=passengers_list,
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
    
    # Get ride with projection
    projection = {
        '_id': 1, 'driverId': 1, 'origin': 1, 'destination': 1,
        'departureTime': 1, 'availableSeats': 1, 'totalSeats': 1,
        'pricePerSeat': 1, 'carModel': 1, 'carPlate': 1, 'status': 1,
        'currency': 1, 'distance': 1, 'duration': 1, 'rideType': 1,
        'splitEnabled': 1, 'isSchoolRide': 1, 'schoolName': 1, 'createdAt': 1
    }
    
    ride = await db.rides.find_one({"_id": ride_id}, projection)
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Get driver with projection
    driver = await db.users.find_one(
        {"_id": ride["driverId"]},
        {"_id": 1, "name": 1, "rating": 1, "avatar": 1}
    )
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    # Get bookings with projection
    bookings = await db.bookings.find(
        {"rideId": ride_id, "status": "confirmed"},
        {"_id": 1, "userId": 1}
    ).to_list(length=100)
    
    # Batch fetch all passengers
    passengers_list = []
    if bookings:
        user_ids = [booking["userId"] for booking in bookings]
        passengers_cursor = db.users.find(
            {"_id": {"$in": user_ids}},
            {"_id": 1, "name": 1, "avatar": 1}
        )
        passengers = await passengers_cursor.to_list(length=None)
        
        for passenger in passengers:
            passengers_list.append(PassengerInfo(
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
        rideType=ride.get("rideType", "split_cost"),
        availableSeats=ride["availableSeats"],
        totalSeats=ride["totalSeats"],
        pricePerSeat=ride["pricePerSeat"],
        currency=ride.get("currency", "ZAR"),
        status=ride["status"],
        passengers=passengers_list,
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
        rideType=ride_data.rideType,
        availableSeats=ride_data.availableSeats,
        totalSeats=ride_data.totalSeats,
        pricePerSeat=ride_data.pricePerSeat,
        currency=ride_data.currency,
        status="available",
        passengers=[],
        distance=ride_doc["distance"],
        duration=ride_doc["duration"],
        splitEnabled=True,
        isSchoolRide=ride_data.isSchoolRide,
        schoolName=ride_data.schoolName,
        createdAt=ride_doc["createdAt"]
    )
    
    return ride_response
