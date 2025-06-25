from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Auth Models
class LoginRequest(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    companyName: Optional[str] = None
    role: str = "customer"
    isAdmin: bool = False
    stage: int = 1

# File Models
class FileUpload(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    size: int
    type: str
    content: str  # base64 encoded content
    userId: str
    uploadedBy: str = "customer"  # customer or admin
    category: str = "general"  # report, certificate, form, document, general
    folderId: Optional[str] = None
    uploadDate: datetime = Field(default_factory=datetime.utcnow)

class FileCreate(BaseModel):
    name: str
    size: int
    type: str
    content: str
    userId: str
    uploadedBy: str = "customer"
    category: str = "general"
    folderId: Optional[str] = None

# Folder Models
class Folder(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    userId: str
    parentId: Optional[str] = None
    createdDate: datetime = Field(default_factory=datetime.utcnow)

class FolderCreate(BaseModel):
    name: str
    userId: str
    parentId: Optional[str] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Auth Endpoints
@api_router.post("/auth/login")
async def login(login_request: LoginRequest):
    # Simple auth logic - in production use proper password hashing
    if login_request.email == "admin@rotakalite.com" and login_request.password == "admin123":
        return User(
            id="admin",
            email=login_request.email,
            name="ROTA Admin",
            role="admin",
            isAdmin=True
        ).dict()
    else:
        # For demo, any other email works as customer
        return User(
            id="customer1",
            email=login_request.email,
            companyName="Örnek Otel A.Ş.",
            stage=2,
            role="customer",
            isAdmin=False
        ).dict()

# File Management Endpoints
@api_router.post("/files", response_model=FileUpload)
async def create_file(file_data: FileCreate):
    file_obj = FileUpload(**file_data.dict())
    result = await db.files.insert_one(file_obj.dict())
    return file_obj

@api_router.get("/files", response_model=List[FileUpload])
async def get_files(userId: Optional[str] = None, uploadedBy: Optional[str] = None, folderId: Optional[str] = None):
    query = {}
    if userId:
        query["userId"] = userId
    if uploadedBy:
        query["uploadedBy"] = uploadedBy
    if folderId is not None:
        query["folderId"] = folderId
    
    files = await db.files.find(query).to_list(1000)
    return [FileUpload(**file) for file in files]

@api_router.delete("/files/{file_id}")
async def delete_file(file_id: str):
    result = await db.files.delete_one({"id": file_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}

# Folder Management Endpoints
@api_router.post("/folders", response_model=Folder)
async def create_folder(folder_data: FolderCreate):
    folder_obj = Folder(**folder_data.dict())
    result = await db.folders.insert_one(folder_obj.dict())
    return folder_obj

@api_router.get("/folders", response_model=List[Folder])
async def get_folders(userId: Optional[str] = None, parentId: Optional[str] = None):
    query = {}
    if userId:
        query["userId"] = userId
    if parentId is not None:
        query["parentId"] = parentId
    
    folders = await db.folders.find(query).to_list(1000)
    return [Folder(**folder) for folder in folders]

@api_router.delete("/folders/{folder_id}")
async def delete_folder(folder_id: str):
    # Delete folder and all files in it
    await db.files.delete_many({"folderId": folder_id})
    result = await db.folders.delete_one({"id": folder_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Folder not found")
    return {"message": "Folder and contents deleted successfully"}

# Sustainable Tourism Folder Creation
@api_router.post("/folders/sustainable-tourism/{user_id}")
async def create_sustainable_tourism_folders(user_id: str):
    """Create sustainable tourism folder structure based on standards"""
    
    # Main sustainable tourism folders
    folders_to_create = [
        # BÖLÜM A: Etkili sürdürülebilir yönetim
        {"name": "A - Sürdürülebilir Yönetim", "parent": None, "children": [
            {"name": "A1 - Sürdürülebilirlik Yönetim Sistemi", "parent": None},
            {"name": "A2 - Yasal Uyum", "parent": None},
            {"name": "A3 - Raporlama ve İletişim", "parent": None},
            {"name": "A4 - Personel Katılımı", "parent": None},
            {"name": "A5 - Müşteri Deneyimi", "parent": None},
            {"name": "A6 - Doğru Tanıtım", "parent": None},
            {"name": "A7 - Binalar ve Altyapı", "parent": None},
            {"name": "A8 - Karadaki Su ve Mülkiyet Hakları", "parent": None},
            {"name": "A9 - Bilgi ve Yorumlama", "parent": None},
            {"name": "A10 - Destinasyonun Katılımı", "parent": None}
        ]},
        
        # BÖLÜM B: Sosyal ve ekonomik faydalar
        {"name": "B - Sosyal ve Ekonomik Faydalar", "parent": None, "children": [
            {"name": "B1 - Yerel Halkın Desteklenmesi", "parent": None},
            {"name": "B2 - Yerel/Bölgesel İstihdam", "parent": None},
            {"name": "B3 - Yerel/Bölgesel Satın Alma", "parent": None},
            {"name": "B4 - Yerel/Bölgesel Girişimciler", "parent": None},
            {"name": "B5 - İstismar ve Taciz", "parent": None},
            {"name": "B6 - Fırsat Eşitliği", "parent": None},
            {"name": "B7 - İyi-Saygın Çalışma", "parent": None},
            {"name": "B8 - Topluma Hizmet Faaliyetleri", "parent": None},
            {"name": "B9 - Yerel/Bölgesel Geçim Kaynakları", "parent": None}
        ]},
        
        # BÖLÜM C: Kültürel miras
        {"name": "C - Kültürel Miras", "parent": None, "children": [
            {"name": "C1 - Kültürel Etkileşimler", "parent": None},
            {"name": "C2 - Kültürel Mirasın Korunması", "parent": None},
            {"name": "C3 - Kültür ve Mirasın Sunulması", "parent": None},
            {"name": "C4 - Eserler", "parent": None}
        ]},
        
        # BÖLÜM D: Çevresel faydalar
        {"name": "D - Çevresel Faydalar", "parent": None, "children": [
            {"name": "D1 - Kaynakları Koruma", "parent": None, "children": [
                {"name": "D1.1 - Enerji Tüketimi", "parent": None},
                {"name": "D1.2 - Su Tüketimi", "parent": None},
                {"name": "D1.3 - Kullanılabilir Su Temininin Korunması", "parent": None}
            ]},
            {"name": "D2 - Kirliliğin Azaltılması", "parent": None, "children": [
                {"name": "D2.1 - Sera Gazı Emisyonları", "parent": None},
                {"name": "D2.2 - Atık Su", "parent": None},
                {"name": "D2.3 - Katı Atık", "parent": None},
                {"name": "D2.4 - Zararlı Maddeler", "parent": None}
            ]},
            {"name": "D3 - Biyoçeşitliliğin Korunması", "parent": None, "children": [
                {"name": "D3.1 - Doğal Alanların Korunması", "parent": None},
                {"name": "D3.2 - Vahşi Yaşam ve Habitatın Korunması", "parent": None},
                {"name": "D3.3 - Ziyaretçilerin Doğal Alanlara Etkisi", "parent": None}
            ]}
        ]}
    ]
    
    created_folders = []
    
    # Create main folders first
    for main_folder in folders_to_create:
        folder_obj = Folder(
            name=main_folder["name"],
            userId=user_id,
            parentId=None
        )
        await db.folders.insert_one(folder_obj.dict())
        created_folders.append(folder_obj)
        
        # Create children folders
        if "children" in main_folder:
            await create_sub_folders(main_folder["children"], user_id, folder_obj.id)
    
    return {"message": f"Sürdürülebilir turizm klasör yapısı {user_id} için oluşturuldu", "folders_created": len(created_folders)}

async def create_sub_folders(children, user_id, parent_id):
    """Recursive function to create sub folders"""
    for child in children:
        folder_obj = Folder(
            name=child["name"],
            userId=user_id,
            parentId=parent_id
        )
        await db.folders.insert_one(folder_obj.dict())
        
        # If this child has children, create them too
        if "children" in child:
            await create_sub_folders(child["children"], user_id, folder_obj.id)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
