from fastapi import HTTPException, Header
from typing import Optional
from auth import decode_access_token

async def get_db():
    """Get database instance from server.py"""
    from server import db
    return db

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        scheme, token = authorization.split()
        if scheme.lower() != 'bearer':
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    db = await get_db()
    user = await db.users.find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

async def get_current_driver(authorization: Optional[str] = Header(None)):
    user = await get_current_user(authorization)
    if user.get("role") != "driver":
        raise HTTPException(status_code=403, detail="Only drivers can access this resource")
    return user
