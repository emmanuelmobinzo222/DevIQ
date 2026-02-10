from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime
from enum import Enum

class SubscriptionTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    ENTERPRISE = "enterprise"

class ProjectStatus(str, Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    EXPORTED = "exported"

class AppPlatform(str, Enum):
    IOS = "ios"
    ANDROID = "android"
    BOTH = "both"

# User Models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    company: Optional[str] = None
    subscriptionTier: SubscriptionTier
    subscriptionStatus: str
    projectsCount: int
    maxProjects: int
    aiCredits: int
    createdAt: datetime
    avatar: str

# Subscription Models
class SubscriptionCreate(BaseModel):
    tier: SubscriptionTier
    paymentMethod: str
    billingCycle: str  # monthly, yearly

class SubscriptionResponse(BaseModel):
    id: str
    userId: str
    tier: SubscriptionTier
    status: str
    amount: float
    currency: str
    billingCycle: str
    nextBillingDate: datetime
    createdAt: datetime

# Project Models
class ProjectCreate(BaseModel):
    name: str
    description: str
    platform: AppPlatform
    template: Optional[str] = None
    appType: str  # e-commerce, social, productivity, etc.

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    code: Optional[Dict] = None

class ProjectResponse(BaseModel):
    id: str
    userId: str
    name: str
    description: str
    platform: AppPlatform
    appType: str
    status: ProjectStatus
    code: Optional[Dict] = None
    preview: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime

# AI Chat Models
class ChatMessage(BaseModel):
    role: str  # user, assistant, system
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ChatRequest(BaseModel):
    projectId: str
    message: str
    context: Optional[Dict] = None

class ChatResponse(BaseModel):
    message: str
    code: Optional[Dict] = None
    suggestions: Optional[List[str]] = None

# Template Models
class TemplateResponse(BaseModel):
    id: str
    name: str
    description: str
    category: str
    platform: AppPlatform
    preview: str
    tier: SubscriptionTier
    features: List[str]
    thumbnail: str

# Export Models
class ExportRequest(BaseModel):
    projectId: str
    platform: AppPlatform
    includeAssets: bool = True

class ExportResponse(BaseModel):
    downloadUrl: str
    expiresAt: datetime
    fileSize: str
