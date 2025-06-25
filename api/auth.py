from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

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

@app.post("/api/auth/login")
async def login(login_request: LoginRequest):
    # Simple auth logic
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
