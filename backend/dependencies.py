from fastapi import HTTPException, Header
from typing import Optional
from auth import decode_access_token

async def get_db():
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

def check_subscription_limits(user: dict, action: str):
    tier = user.get('subscriptionTier', 'free')
    
    limits = {
        'free': {'maxProjects': 3, 'aiCredits': 100},
        'pro': {'maxProjects': -1, 'aiCredits': 5000},
        'enterprise': {'maxProjects': -1, 'aiCredits': -1}
    }
    
    tier_limits = limits.get(tier, limits['free'])
    
    if action == 'create_project':
        if tier_limits['maxProjects'] != -1 and user.get('projectsCount', 0) >= tier_limits['maxProjects']:
            raise HTTPException(
                status_code=403, 
                detail=f"Project limit reached. Upgrade to Pro for unlimited projects."
            )
    
    if action == 'use_ai':
        if tier_limits['aiCredits'] != -1 and user.get('aiCredits', 0) <= 0:
            raise HTTPException(
                status_code=403,
                detail="AI credits exhausted. Upgrade your plan for more credits."
            )
    
    return True
