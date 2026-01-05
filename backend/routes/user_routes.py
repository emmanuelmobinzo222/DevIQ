from fastapi import APIRouter, HTTPException, Depends
from models import UserResponse, UserUpdate
from dependencies import db, get_current_user
from datetime import datetime

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_response = UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        phone=user["phone"],
        role=user["role"],
        rating=user["rating"],
        totalRides=user["totalRides"],
        verified=user["verified"],
        cardVerified=user.get("cardVerified", True),
        idVerified=user.get("idVerified", True),
        location=user.get("location"),
        avatar=user["avatar"],
        carModel=user.get("carModel"),
        carPlate=user.get("carPlate"),
        createdAt=user["createdAt"]
    )
    
    return user_response

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    user_data: UserUpdate,
    authorization: str = Depends(lambda: None)
):
    from dependencies import get_current_user
    current_user = await get_current_user(authorization)
    
    # Only allow users to update their own profile
    if current_user["_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this user")
    
    # Build update document
    update_doc = {"updatedAt": datetime.utcnow()}
    if user_data.name:
        update_doc["name"] = user_data.name
    if user_data.phone:
        update_doc["phone"] = user_data.phone
    if user_data.carModel:
        update_doc["carModel"] = user_data.carModel
    if user_data.carPlate:
        update_doc["carPlate"] = user_data.carPlate
    
    # Update user
    await db.users.update_one(
        {"_id": user_id},
        {"$set": update_doc}
    )
    
    # Get updated user
    updated_user = await db.users.find_one({"_id": user_id})
    
    user_response = UserResponse(
        id=updated_user["_id"],
        name=updated_user["name"],
        email=updated_user["email"],
        phone=updated_user["phone"],
        role=updated_user["role"],
        rating=updated_user["rating"],
        totalRides=updated_user["totalRides"],
        verified=updated_user["verified"],
        cardVerified=updated_user.get("cardVerified", True),
        idVerified=updated_user.get("idVerified", True),
        location=updated_user.get("location"),
        avatar=updated_user["avatar"],
        carModel=updated_user.get("carModel"),
        carPlate=updated_user.get("carPlate"),
        createdAt=updated_user["createdAt"]
    )
    
    return user_response
