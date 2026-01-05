from fastapi import APIRouter, HTTPException, Depends
from models import BookingCreate, BookingResponse, RideHistory
from dependencies import get_current_user
from datetime import datetime
from typing import List
import uuid

router = APIRouter(prefix="/bookings", tags=["bookings"])

async def get_db():
    from server import db
    return db

@router.post("/rides/{ride_id}/book", response_model=BookingResponse)
async def book_ride(
    ride_id: str,
    booking_data: BookingCreate,
    authorization: str = Depends(lambda: None)
):
    from dependencies import get_current_user
    user = await get_current_user(authorization)
    db = await get_db()
    
    # Get ride
    ride = await db.rides.find_one({"_id": ride_id})
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    # Check if user is the driver
    if ride["driverId"] == user["_id"]:
        raise HTTPException(status_code=400, detail="Drivers cannot book their own rides")
    
    # Check available seats
    if ride["availableSeats"] < booking_data.seats:
        raise HTTPException(status_code=400, detail="Not enough seats available")
    
    # Calculate cost
    if booking_data.splitFare:
        # Get current number of passengers
        bookings_count = await db.bookings.count_documents({
            "rideId": ride_id,
            "status": "confirmed"
        })
        total_passengers = bookings_count + 1  # Including this booking
        total_fare = ride["pricePerSeat"] * ride["totalSeats"]
        cost = total_fare / total_passengers
    else:
        cost = ride["pricePerSeat"] * booking_data.seats
    
    # Create booking
    booking_id = str(uuid.uuid4())
    booking_doc = {
        "_id": booking_id,
        "rideId": ride_id,
        "userId": user["_id"],
        "seats": booking_data.seats,
        "cost": cost,
        "splitFare": booking_data.splitFare,
        "status": "confirmed",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.bookings.insert_one(booking_doc)
    
    # Update ride available seats
    new_available_seats = ride["availableSeats"] - booking_data.seats
    await db.rides.update_one(
        {"_id": ride_id},
        {
            "$set": {
                "availableSeats": new_available_seats,
                "updatedAt": datetime.utcnow()
            }
        }
    )
    
    # Update user total rides
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"totalRides": 1}}
    )
    
    booking_response = BookingResponse(
        id=booking_id,
        rideId=ride_id,
        userId=user["_id"],
        seats=booking_data.seats,
        cost=cost,
        splitFare=booking_data.splitFare,
        status="confirmed",
        createdAt=booking_doc["createdAt"]
    )
    
    return booking_response

@router.get("/users/{user_id}/history", response_model=List[RideHistory])
async def get_user_history(
    user_id: str,
    authorization: str = Depends(lambda: None)
):
    from dependencies import get_current_user
    current_user = await get_current_user(authorization)
    db = await get_db()
    
    # Only allow users to see their own history
    if current_user["_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user's history")
    
    # Get all bookings for user
    bookings = await db.bookings.find({
        "userId": user_id,
        "status": "confirmed"
    }).sort("createdAt", -1).to_list(length=100)
    
    history = []
    for booking in bookings:
        ride = await db.rides.find_one({"_id": booking["rideId"]})
        if ride:
            # Count how many people split the fare
            total_bookings = await db.bookings.count_documents({
                "rideId": booking["rideId"],
                "status": "confirmed"
            })
            
            ride_history = RideHistory(
                id=booking["_id"],
                date=booking["createdAt"].strftime("%Y-%m-%d"),
                origin=ride["origin"]["address"],
                destination=ride["destination"]["address"],
                fare=ride["pricePerSeat"] * booking["seats"],
                splitWith=total_bookings if booking["splitFare"] else 1,
                finalCost=booking["cost"],
                status="completed",
                rating=booking.get("rating")
            )
            history.append(ride_history)
    
    return history
