from fastapi import APIRouter, HTTPException, Depends
from models import TemplateResponse, AppPlatform, SubscriptionTier
from typing import List

router = APIRouter(prefix="/templates", tags=["templates"])

# Mock templates - in production, store in database
TEMPLATES = [
    {
        "id": "template-1",
        "name": "E-Commerce App",
        "description": "Complete e-commerce solution with product catalog, cart, and checkout",
        "category": "E-Commerce",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=E-Commerce+App",
        "tier": SubscriptionTier.FREE.value,
        "features": ["Product Catalog", "Shopping Cart", "Payment Integration", "Order Tracking"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=E-Commerce"
    },
    {
        "id": "template-2",
        "name": "Social Media App",
        "description": "Social networking app with feeds, profiles, and messaging",
        "category": "Social",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=Social+Media",
        "tier": SubscriptionTier.PRO.value,
        "features": ["User Profiles", "News Feed", "Messaging", "Notifications"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=Social"
    },
    {
        "id": "template-3",
        "name": "Food Delivery App",
        "description": "Restaurant ordering and delivery tracking app",
        "category": "Food & Drink",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=Food+Delivery",
        "tier": SubscriptionTier.FREE.value,
        "features": ["Restaurant Listings", "Menu Browse", "Cart", "Real-time Tracking"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=Food"
    },
    {
        "id": "template-4",
        "name": "Fitness Tracker",
        "description": "Health and fitness tracking with workouts and nutrition",
        "category": "Health & Fitness",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=Fitness+Tracker",
        "tier": SubscriptionTier.FREE.value,
        "features": ["Workout Tracking", "Nutrition Log", "Progress Charts", "Goals"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=Fitness"
    },
    {
        "id": "template-5",
        "name": "Task Manager",
        "description": "Productivity app with tasks, projects, and team collaboration",
        "category": "Productivity",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=Task+Manager",
        "tier": SubscriptionTier.FREE.value,
        "features": ["Task Lists", "Projects", "Reminders", "Team Collaboration"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=Tasks"
    },
    {
        "id": "template-6",
        "name": "Real Estate App",
        "description": "Property listings with search, filters, and virtual tours",
        "category": "Real Estate",
        "platform": AppPlatform.BOTH.value,
        "preview": "https://via.placeholder.com/400x800.png?text=Real+Estate",
        "tier": SubscriptionTier.PRO.value,
        "features": ["Property Search", "Filters", "Favorites", "Virtual Tours"],
        "thumbnail": "https://via.placeholder.com/200x300.png?text=RealEstate"
    }
]

@router.get("", response_model=List[TemplateResponse])
async def get_templates(category: str = None, tier: str = None):
    templates = TEMPLATES
    
    if category:
        templates = [t for t in templates if t["category"].lower() == category.lower()]
    
    if tier:
        templates = [t for t in templates if t["tier"] == tier]
    
    return [TemplateResponse(**t) for t in templates]

@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str):
    template = next((t for t in TEMPLATES if t["id"] == template_id), None)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    return TemplateResponse(**template)
