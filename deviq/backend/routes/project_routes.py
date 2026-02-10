from fastapi import APIRouter, HTTPException, Depends
from models import ProjectCreate, ProjectUpdate, ProjectResponse, ProjectStatus, AppPlatform
from dependencies import get_current_user, check_subscription_limits
from typing import List
from datetime import datetime
import uuid

router = APIRouter(prefix="/projects", tags=["projects"])

async def get_db():
    from server import db
    return db

@router.get("", response_model=List[ProjectResponse])
async def get_projects(authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    db = await get_db()
    
    projects = await db.projects.find(
        {"userId": user["_id"]},
        {"_id": 1, "userId": 1, "name": 1, "description": 1, "platform": 1, 
         "appType": 1, "status": 1, "preview": 1, "createdAt": 1, "updatedAt": 1}
    ).sort("createdAt", -1).to_list(length=100)
    
    return [ProjectResponse(
        id=p["_id"],
        userId=p["userId"],
        name=p["name"],
        description=p["description"],
        platform=p["platform"],
        appType=p["appType"],
        status=p["status"],
        code=None,
        preview=p.get("preview"),
        createdAt=p["createdAt"],
        updatedAt=p["updatedAt"]
    ) for p in projects]

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    db = await get_db()
    
    project = await db.projects.find_one({"_id": project_id, "userId": user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=project["_id"],
        userId=project["userId"],
        name=project["name"],
        description=project["description"],
        platform=project["platform"],
        appType=project["appType"],
        status=project["status"],
        code=project.get("code"),
        preview=project.get("preview"),
        createdAt=project["createdAt"],
        updatedAt=project["updatedAt"]
    )

@router.post("", response_model=ProjectResponse)
async def create_project(project_data: ProjectCreate, authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    check_subscription_limits(user, 'create_project')
    db = await get_db()
    
    project_id = str(uuid.uuid4())
    project_doc = {
        "_id": project_id,
        "userId": user["_id"],
        "name": project_data.name,
        "description": project_data.description,
        "platform": project_data.platform.value,
        "appType": project_data.appType,
        "status": ProjectStatus.DRAFT.value,
        "code": {},
        "preview": None,
        "template": project_data.template,
        "createdAt": datetime.utcnow(),
        "updatedAt": datetime.utcnow()
    }
    
    await db.projects.insert_one(project_doc)
    
    # Update user projects count
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"projectsCount": 1}}
    )
    
    return ProjectResponse(
        id=project_id,
        userId=user["_id"],
        name=project_data.name,
        description=project_data.description,
        platform=project_data.platform,
        appType=project_data.appType,
        status=ProjectStatus.DRAFT,
        code={},
        preview=None,
        createdAt=project_doc["createdAt"],
        updatedAt=project_doc["updatedAt"]
    )

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    authorization: str = Depends(lambda: None)
):
    user = await get_current_user(authorization)
    db = await get_db()
    
    project = await db.projects.find_one({"_id": project_id, "userId": user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_doc = {"updatedAt": datetime.utcnow()}
    if project_data.name:
        update_doc["name"] = project_data.name
    if project_data.description:
        update_doc["description"] = project_data.description
    if project_data.status:
        update_doc["status"] = project_data.status.value
    if project_data.code:
        update_doc["code"] = project_data.code
    
    await db.projects.update_one(
        {"_id": project_id},
        {"$set": update_doc}
    )
    
    updated_project = await db.projects.find_one({"_id": project_id})
    
    return ProjectResponse(
        id=updated_project["_id"],
        userId=updated_project["userId"],
        name=updated_project["name"],
        description=updated_project["description"],
        platform=updated_project["platform"],
        appType=updated_project["appType"],
        status=updated_project["status"],
        code=updated_project.get("code"),
        preview=updated_project.get("preview"),
        createdAt=updated_project["createdAt"],
        updatedAt=updated_project["updatedAt"]
    )

@router.delete("/{project_id}")
async def delete_project(project_id: str, authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    db = await get_db()
    
    project = await db.projects.find_one({"_id": project_id, "userId": user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.projects.delete_one({"_id": project_id})
    
    # Update user projects count
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"projectsCount": -1}}
    )
    
    return {"message": "Project deleted successfully"}
