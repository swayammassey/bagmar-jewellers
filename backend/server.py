import json
import logging
import os
import uuid
from datetime import date, datetime, time, timezone
from pathlib import Path
from typing import Optional

import firebase_admin
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, Header, HTTPException
from firebase_admin import auth as firebase_auth
from firebase_admin import credentials, firestore
from pydantic import BaseModel, ConfigDict, Field, field_validator
from starlette.middleware.cors import CORSMiddleware


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
firebase_app = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class AppointmentRequestCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=8, max_length=20, pattern=r"^[0-9+() -]{8,20}$")
    appointment_date: date
    appointment_time: time

    @field_validator("name", "phone", mode="before")
    @classmethod
    def strip_text(cls, value):
        return value.strip() if isinstance(value, str) else value

class AppointmentRequest(AppointmentRequestCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    submitted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentRequestResponse(BaseModel):
    id: str
    status: str
    submitted_at: datetime

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Bagmar Jewellers API"}

def get_firestore_client():
    global firebase_app
    if firebase_app is None:
        service_account_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        project_id = os.environ.get("FIREBASE_PROJECT_ID")
        options = {"projectId": project_id} if project_id else None
        try:
            if service_account_json:
                firebase_credential = credentials.Certificate(json.loads(service_account_json))
                firebase_app = firebase_admin.initialize_app(firebase_credential, options)
            else:
                firebase_app = firebase_admin.initialize_app(options=options)
        except Exception as exc:
            logger.error("Firebase Admin initialization failed: %s", type(exc).__name__)
            raise HTTPException(status_code=503, detail="Appointment storage is unavailable.") from exc
    return firestore.client(firebase_app)

@api_router.post("/appointments", response_model=AppointmentRequestResponse, status_code=201)
def create_appointment_request(input: AppointmentRequestCreate):
    request = AppointmentRequest(**input.model_dump())
    try:
        get_firestore_client().collection("appointment_requests").document(request.id).set(
            request.model_dump(mode="json")
        )
    except HTTPException:
        raise
    except Exception as exc:
        logger.error("Appointment request save failed: %s", type(exc).__name__)
        raise HTTPException(status_code=503, detail="Appointment request could not be saved.") from exc
    return AppointmentRequestResponse(
        id=request.id,
        status="saved",
        submitted_at=request.submitted_at,
    )

def serialize_firestore_document(document):
    data = document.to_dict() or {}
    data["id"] = document.id
    for key, value in data.items():
        if isinstance(value, datetime):
            data[key] = value.isoformat()
    return data

@api_router.get("/admin/records")
def get_admin_records(authorization: Optional[str] = Header(default=None)):
    admin_emails = {
        email.strip().lower()
        for email in os.environ.get("ADMIN_EMAILS", "").split(",")
        if email.strip()
    }
    if not admin_emails:
        raise HTTPException(status_code=503, detail="Admin access is not configured.")
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Sign-in is required.")

    client = get_firestore_client()
    try:
        user = firebase_auth.verify_id_token(authorization.removeprefix("Bearer "), app=firebase_app)
    except Exception as exc:
        logger.warning("Admin token verification failed: %s", type(exc).__name__)
        raise HTTPException(status_code=401, detail="Sign-in is required.") from exc
    if str(user.get("email", "")).lower() not in admin_emails:
        raise HTTPException(status_code=403, detail="Admin access is required.")

    try:
        appointments = client.collection("appointment_requests").order_by(
            "submitted_at", direction=firestore.Query.DESCENDING
        ).limit(100).stream()
        return {
            "appointments": [serialize_firestore_document(doc) for doc in appointments],
        }
    except Exception as exc:
        logger.error("Admin records load failed: %s", type(exc).__name__)
        raise HTTPException(status_code=503, detail="Records could not be loaded.") from exc
# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
