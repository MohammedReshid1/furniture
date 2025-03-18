import os
import motor.motor_asyncio
from beanie import init_beanie
from typing import Optional, List, Any
from contextlib import asynccontextmanager

# Get MongoDB URL from environment variable or use default
MONGODB_URL = os.environ.get(
    "MONGODB_URL", 
    "mongodb://localhost:27017/furniture_haven"
)

# Create MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.get_default_database()

# Global database session
async def init_db():
    # Import models - must import here to avoid circular imports
    from .models import (
        User, 
        Address, 
        Category, 
        Product, 
        ProductImage, 
        CartItem, 
        Order, 
        OrderItem, 
        Review
    )
    
    # Initialize Beanie with the models
    await init_beanie(
        database=db,
        document_models=[
            User,
            Address,
            Category,
            Product,
            ProductImage,
            CartItem,
            Order,
            OrderItem,
            Review
        ]
    )

# Dependency to get the database
async def get_db():
    return db 