from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import List, Optional, Union
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    sub: Optional[str] = None
    exp: Optional[int] = None

# Address schemas
class AddressBase(BaseModel):
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    postal_code: str
    country: str
    is_default: bool = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(BaseModel):
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    is_default: Optional[bool] = None

class AddressResponse(AddressBase):
    id: int
    user_id: int
    
    model_config = ConfigDict(from_attributes=True)

# Category schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryCreate(CategoryBase):
    slug: str

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None

class CategoryResponse(CategoryBase):
    id: int
    slug: str
    
    model_config = ConfigDict(from_attributes=True)

# Product image schemas
class ProductImageBase(BaseModel):
    image_url: str
    alt_text: Optional[str] = None
    is_primary: bool = False

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageUpdate(BaseModel):
    image_url: Optional[str] = None
    alt_text: Optional[str] = None
    is_primary: Optional[bool] = None

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    
    model_config = ConfigDict(from_attributes=True)

# Product schemas
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    sale_price: Optional[float] = None
    stock: int = 0
    is_active: bool = True

class ProductCreate(ProductBase):
    slug: str
    category_ids: List[int]
    images: List[ProductImageCreate] = []

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    sale_price: Optional[float] = None
    stock: Optional[int] = None
    is_active: Optional[bool] = None
    category_ids: Optional[List[int]] = None

class ProductResponse(ProductBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    categories: List[CategoryResponse] = []
    images: List[ProductImageResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

# Cart item schemas
class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    added_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

# Order schemas
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int

class OrderCreate(BaseModel):
    address_id: int
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: int
    product: ProductResponse
    quantity: int
    price: float
    
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(BaseModel):
    id: int
    user_id: int
    address: AddressResponse
    total_amount: float
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItemResponse]
    
    model_config = ConfigDict(from_attributes=True)

# Review schemas
class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    comment: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: UserBase
    
    model_config = ConfigDict(from_attributes=True) 