from fastapi import FastAPI, APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title='BEPCoR API', version='1.0.0')
api_router = APIRouter(prefix="/api")


# ---------- Helpers ----------
def new_id() -> str:
    return str(uuid.uuid4())


def now() -> datetime:
    return datetime.utcnow()


def serialize(doc: dict) -> dict:
    if not doc:
        return doc
    doc.pop('_id', None)
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


# ---------- Models ----------
class NewsletterIn(BaseModel):
    email: EmailStr


class DonationIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    phone: Optional[str] = None
    amount: int = Field(gt=0, le=10_000_000)
    tier: Optional[str] = None


class VolunteerIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    interest: str = Field(min_length=1, max_length=120)
    message: Optional[str] = None


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = None
    message: str = Field(min_length=1, max_length=4000)


# ---------- Seed data (posts) ----------
SEED_POSTS = [
    {
        'slug': 'why-native-bees-matter',
        'title': 'Why native bees matter more than you think',
        'category': 'Pollinators',
        'date': 'Jun 12, 2025',
        'read_time': '6 min read',
        'excerpt': 'India has over 700 species of native bees. Most of them are not the honeybee you imagine. Here is why every one of them counts for our food and forests.',
        'image': 'https://images.unsplash.com/photo-1589526261866-ab0d34f8dc19?crop=entropy&cs=srgb&fm=jpg&q=85',
        'author': 'Teja Ghorpade',
        'content': 'India is home to more than 700 species of native bees. Only a small fraction are the familiar honeybees we recognize. From tiny stingless bees to large carpenter bees, each species has evolved to pollinate specific plants. Losing them means losing entire food systems and forest ecosystems. At BEPCoR, our work begins with recognizing this diversity.',
    },
    {
        'slug': 'madhu-shakti-women',
        'title': 'Madhu Shakti: How 12 women re-wrote the honey economy',
        'category': 'Livelihoods',
        'date': 'May 22, 2025',
        'read_time': '8 min read',
        'excerpt': 'From tribal hamlets in the Sahyadris, a quiet enterprise is reshaping conservation-linked income for rural women.',
        'image': 'https://images.pexels.com/photos/32633821/pexels-photo-32633821.jpeg',
        'author': 'Field Team',
        'content': 'The Madhu Shakti collective began with twelve women in a single hamlet. Today it spans three districts, producing forest-safe honey that funds household savings, school fees and cooperative ownership. This is what conservation-linked livelihood looks like when women lead.',
    },
    {
        'slug': 'pollinator-garden-guide',
        'title': 'A monsoon guide to your first pollinator garden',
        'category': 'How-To',
        'date': 'May 05, 2025',
        'read_time': '5 min read',
        'excerpt': 'Ten native plants, four simple design rules and one honest promise — you will hear more birds within a season.',
        'image': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
        'author': 'Habitat Team',
        'content': 'A pollinator garden is not about aesthetics — it is about invitation. Plant native. Layer heights. Avoid pesticides. Leave water. Within a monsoon, you will notice hoverflies, butterflies, sunbirds and, if you are lucky, a carpenter bee dozing in a stem.',
    },
    {
        'slug': 'ecoliteracy-schools',
        'title': 'What ecoliteracy actually looks like in a Std 6 classroom',
        'category': 'Education',
        'date': 'Apr 18, 2025',
        'read_time': '7 min read',
        'excerpt': 'Notes from a term of teaching pollinators, food webs and empathy in a Zilla Parishad school.',
        'image': 'https://images.pexels.com/photos/36866288/pexels-photo-36866288.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
        'author': 'Anushka Patil',
        'content': 'Twelve weeks. Forty students. One school garden. Our E-STEM curriculum invites students to become citizen scientists in their own courtyard. They count pollinators, sketch flowers, and ask sharper questions than adults do.',
    },
    {
        'slug': 'western-ghats-baseline',
        'title': 'Baseline notes from a Western Ghats pollinator survey',
        'category': 'Research',
        'date': 'Mar 30, 2025',
        'read_time': '9 min read',
        'excerpt': 'The first year of our long-term monitoring plots yielded surprises — including a species we did not expect this far south.',
        'image': 'https://images.unsplash.com/photo-1593069567131-53a0614dde1d',
        'author': 'Research Team',
        'content': 'Baseline surveys are the humble cousins of dramatic conservation stories. They record what is there — and quietly, they record what has slipped away. Our first year plots in the Western Ghats produced 214 pollinator morphospecies, including an unexpected southern record.',
    },
    {
        'slug': 'sbi-foundation-grant',
        'title': 'We received an ₹11 lakh grant. Here is our plan.',
        'category': 'News',
        'date': 'Apr 04, 2025',
        'read_time': '4 min read',
        'excerpt': 'Selected at the SBI Youth for India Conclave, we are scaling women-led beekeeping across three new districts.',
        'image': 'https://images.pexels.com/photos/2260931/pexels-photo-2260931.jpeg',
        'author': 'BEPCoR Team',
        'content': 'We were honoured to be selected among six social ventures at the SBI Foundation Youth for India Conclave. The ₹11 lakh grant will fund three district-level Madhu Shakti chapters, teacher training for E-STEM, and a dedicated pollinator monitoring officer.',
    },
]


@app.on_event("startup")
async def seed_data():
    count = await db.posts.count_documents({})
    if count == 0:
        docs = []
        for p in SEED_POSTS:
            docs.append({**p, 'id': new_id(), 'created_at': now()})
        if docs:
            await db.posts.insert_many(docs)
            logger.info(f"Seeded {len(docs)} posts")


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "BEPCoR API", "status": "ok"}


# Newsletter
@api_router.post("/newsletter/subscribe", status_code=201)
async def subscribe(payload: NewsletterIn):
    email = payload.email.lower()
    existing = await db.newsletter_subscribers.find_one({'email': email})
    if existing:
        raise HTTPException(status_code=409, detail='Email is already subscribed')
    doc = {'id': new_id(), 'email': email, 'subscribed_at': now()}
    await db.newsletter_subscribers.insert_one(doc)
    return serialize(dict(doc))


# Donations
@api_router.post("/donations", status_code=201)
async def create_donation(payload: DonationIn):
    doc = {'id': new_id(), **payload.model_dump(), 'status': 'pending', 'created_at': now()}
    await db.donations.insert_one(dict(doc))
    return serialize(dict(doc))


@api_router.get("/donations")
async def list_donations(limit: int = Query(50, ge=1, le=500)):
    items = await db.donations.find().sort('created_at', -1).to_list(limit)
    return [serialize(i) for i in items]


# Volunteers
@api_router.post("/volunteers", status_code=201)
async def create_volunteer(payload: VolunteerIn):
    doc = {'id': new_id(), **payload.model_dump(), 'created_at': now()}
    await db.volunteers.insert_one(dict(doc))
    return serialize(dict(doc))


@api_router.get("/volunteers")
async def list_volunteers(limit: int = Query(50, ge=1, le=500)):
    items = await db.volunteers.find().sort('created_at', -1).to_list(limit)
    return [serialize(i) for i in items]


# Contact
@api_router.post("/contact", status_code=201)
async def create_contact(payload: ContactIn):
    doc = {'id': new_id(), **payload.model_dump(), 'created_at': now()}
    await db.contact_messages.insert_one(dict(doc))
    return serialize(dict(doc))


@api_router.get("/contact")
async def list_contacts(limit: int = Query(50, ge=1, le=500)):
    items = await db.contact_messages.find().sort('created_at', -1).to_list(limit)
    return [serialize(i) for i in items]


# Posts
@api_router.get("/posts")
async def list_posts(category: Optional[str] = None, q: Optional[str] = None, limit: int = Query(50, ge=1, le=200)):
    query = {}
    if category and category.lower() != 'all':
        query['category'] = category
    if q:
        query['$or'] = [
            {'title': {'$regex': q, '$options': 'i'}},
            {'excerpt': {'$regex': q, '$options': 'i'}},
        ]
    items = await db.posts.find(query).sort('created_at', -1).to_list(limit)
    return [serialize(i) for i in items]


@api_router.get("/posts/{slug}")
async def get_post(slug: str):
    doc = await db.posts.find_one({'slug': slug})
    if not doc:
        raise HTTPException(status_code=404, detail='Post not found')
    return serialize(doc)


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
