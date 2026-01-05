from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, UserResponse
from auth import get_password_hash, verify_password, create_access_token, hash_card_number
from datetime import datetime
import uuid

router = APIRouter(prefix="/auth", tags=["authentication"])

async def get_db():
    from server import db
    return db

@router.post("/signup")
async def signup(user_data: UserCreate):
    db = await get_db()
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate card number (basic validation)
    if len(user_data.cardNumber) < 13 or len(user_data.cardNumber) > 19:
        raise HTTPException(status_code=400, detail="Invalid card number")
    
    # Create user document
    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": get_password_hash(user_data.password),
        "phone": user_data.phone,
        "role": user_data.role,
        "rating": 5.0,
        "totalRides": 0,
        "verified": True,
        "cardVerified": True,
        "idVerified": True,
        "cardLast4": hash_card_number(user_data.cardNumber),
        "location": user_data.location.dict() if user_data.location else None,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.email}",
        "carModel": None,
        "carPlate": None,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id, "email": user_data.email})
    
    # Return user response
    user_response = UserResponse(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        phone=user_data.phone,
        role=user_data.role,
        rating=5.0,
        totalRides=0,
        verified=True,
        cardVerified=True,
        idVerified=True,
        location=user_data.location,
        avatar=user_doc["avatar"],
        createdAt=user_doc["createdAt"]
    )
    
    return {
        "user": user_response,
        "token": access_token
    }

@router.post("/login")
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create access token
    access_token = create_access_token(data={"sub": user["_id"], "email": user["email"]})
    
    # Return user response
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
    
    return {
        "user": user_response,
        "token": access_token
    }

@router.get("/me")
async def get_me(current_user = Depends(lambda authorization: __import__('dependencies').get_current_user(authorization))):
    user_response = UserResponse(
        id=current_user["_id"],
        name=current_user["name"],
        email=current_user["email"],
        phone=current_user["phone"],
        role=current_user["role"],
        rating=current_user["rating"],
        totalRides=current_user["totalRides"],
        verified=current_user["verified"],
        cardVerified=current_user.get("cardVerified", True),
        idVerified=current_user.get("idVerified", True),
        location=current_user.get("location"),
        avatar=current_user["avatar"],
        carModel=current_user.get("carModel"),
        carPlate=current_user.get("carPlate"),
        createdAt=current_user["createdAt"]
    )
    return {"user": user_response}
