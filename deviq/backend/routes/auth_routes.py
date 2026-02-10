from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, UserResponse, SubscriptionTier
from auth import get_password_hash, verify_password, create_access_token
from datetime import datetime
import uuid

router = APIRouter(prefix="/auth", tags=["authentication"])

async def get_db():
    from server import db
    return db

@router.post("/signup")
async def signup(user_data: UserCreate):
    db = await get_db()
    
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": get_password_hash(user_data.password),
        "company": user_data.company,
        "subscriptionTier": SubscriptionTier.FREE.value,
        "subscriptionStatus": "active",
        "projectsCount": 0,
        "maxProjects": 3,
        "aiCredits": 100,
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_data.email}",
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user_id, "email": user_data.email})
    
    user_response = UserResponse(
        id=user_id,
        name=user_data.name,
        email=user_data.email,
        company=user_data.company,
        subscriptionTier=SubscriptionTier.FREE,
        subscriptionStatus="active",
        projectsCount=0,
        maxProjects=3,
        aiCredits=100,
        avatar=user_doc["avatar"],
        createdAt=user_doc["createdAt"]
    )
    
    return {"user": user_response, "token": access_token}

@router.post("/login")
async def login(credentials: UserLogin):
    db = await get_db()
    
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["_id"], "email": user["email"]})
    
    user_response = UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        company=user.get("company"),
        subscriptionTier=user["subscriptionTier"],
        subscriptionStatus=user["subscriptionStatus"],
        projectsCount=user["projectsCount"],
        maxProjects=user["maxProjects"],
        aiCredits=user["aiCredits"],
        avatar=user["avatar"],
        createdAt=user["createdAt"]
    )
    
    return {"user": user_response, "token": access_token}

@router.get("/me")
async def get_me(authorization: str = Depends(lambda: None)):
    from dependencies import get_current_user
    user = await get_current_user(authorization)
    
    user_response = UserResponse(
        id=user["_id"],
        name=user["name"],
        email=user["email"],
        company=user.get("company"),
        subscriptionTier=user["subscriptionTier"],
        subscriptionStatus=user["subscriptionStatus"],
        projectsCount=user["projectsCount"],
        maxProjects=user["maxProjects"],
        aiCredits=user["aiCredits"],
        avatar=user["avatar"],
        createdAt=user["createdAt"]
    )
    
    return {"user": user_response}
