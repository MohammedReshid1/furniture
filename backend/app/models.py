from beanie import Document, Link, before_event, Insert, Replace
from typing import List, Optional, Union
from pydantic import Field, EmailStr
from datetime import datetime
import uuid

# Generate a UUID for new documents
def generate_id() -> str:
    return str(uuid.uuid4())

class User(Document):
    id: str = Field(default_factory=generate_id)
    email: EmailStr
    full_name: str
    hashed_password: str
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "is_admin"
        ]

class Address(Document):
    id: str = Field(default_factory=generate_id)
    user_id: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool = False
    
    class Settings:
        name = "addresses"
        indexes = [
            "user_id",
        ]

class Category(Document):
    id: str = Field(default_factory=generate_id)
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    
    class Settings:
        name = "categories"
        indexes = [
            "slug",
        ]

class ProductImage(Document):
    id: str = Field(default_factory=generate_id)
    product_id: str
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False
    
    class Settings:
        name = "product_images"
        indexes = [
            "product_id",
        ]

class Product(Document):
    id: str = Field(default_factory=generate_id)
    name: str
    slug: str
    description: str
    price: float
    sale_price: Optional[float] = None
    stock: int = 0
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    category_ids: List[str] = []
    
    class Settings:
        name = "products"
        indexes = [
            "slug",
            "category_ids"
        ]

class CartItem(Document):
    id: str = Field(default_factory=generate_id)
    user_id: str
    product_id: str
    quantity: int = 1
    added_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "cart_items"
        indexes = [
            "user_id",
            "product_id"
        ]

class OrderItem(Document):
    id: str = Field(default_factory=generate_id)
    order_id: str
    product_id: str
    quantity: int
    price: float
    
    class Settings:
        name = "order_items"
        indexes = [
            "order_id",
        ]

class Order(Document):
    id: str = Field(default_factory=generate_id)
    user_id: str
    address_id: str
    total_amount: float
    status: str = "pending"  # pending, processing, shipped, delivered, cancelled
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "orders"
        indexes = [
            "user_id",
            "status"
        ]

class Review(Document):
    id: str = Field(default_factory=generate_id)
    user_id: str
    product_id: str
    rating: int  # 1-5 stars
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "reviews"
        indexes = [
            "user_id",
            "product_id"
        ]

# Update user model to set updated_at automatically
@before_event([User], Insert, Replace)
def set_user_updated_at(user: User):
    user.updated_at = datetime.utcnow()

# Update product model to set updated_at automatically
@before_event([Product], Insert, Replace)
def set_product_updated_at(product: Product):
    product.updated_at = datetime.utcnow()

# Update order model to set updated_at automatically
@before_event([Order], Insert, Replace)
def set_order_updated_at(order: Order):
    order.updated_at = datetime.utcnow()

# Update review model to set updated_at automatically  
@before_event([Review], Insert, Replace)
def set_review_updated_at(review: Review):
    review.updated_at = datetime.utcnow() 