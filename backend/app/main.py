from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routers import products, users, auth, cart, orders
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create the FastAPI app
app = FastAPI(
    title="Furniture Haven API",
    description="Backend API for Furniture Haven e-commerce website",
    version="1.0.0"
)

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(cart.router, prefix="/api/cart", tags=["Cart"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])

@app.get("/api/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "message": "API is running"}

@app.on_event("startup")
async def startup_db_client():
    logger.info("Connecting to MongoDB...")
    await init_db()
    logger.info("Connected to MongoDB!")

@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Disconnecting from MongoDB...") 