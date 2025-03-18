from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from ..database import get_db
from ..models import Product, Category, ProductImage, Review
from ..schemas import (
    ProductResponse, ProductCreate, ProductUpdate,
    ReviewCreate, ReviewResponse, ReviewUpdate,
    CategoryResponse
)
from ..utils.auth import get_current_active_user, get_current_admin_user
from ..models import User

router = APIRouter()

# Products
@router.get("/", response_model=List[ProductResponse])
async def read_products(
    skip: int = 0,
    limit: int = 10,
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    sort_by: Optional[str] = "created_at",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db)
):
    """Get all products with filtering and sorting options"""
    query = db.query(Product).filter(Product.is_active == True)
    
    # Apply category filter
    if category:
        query = query.join(Product.categories).filter(Category.slug == category)
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(Product.name.ilike(search_term) | Product.description.ilike(search_term))
    
    # Apply price filters
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)
    
    # Apply sorting
    if sort_by == "price":
        if sort_order == "asc":
            query = query.order_by(Product.price.asc())
        else:
            query = query.order_by(Product.price.desc())
    elif sort_by == "name":
        if sort_order == "asc":
            query = query.order_by(Product.name.asc())
        else:
            query = query.order_by(Product.name.desc())
    else:  # default sort by created_at
        if sort_order == "asc":
            query = query.order_by(Product.created_at.asc())
        else:
            query = query.order_by(Product.created_at.desc())
    
    # Apply pagination
    products = query.offset(skip).limit(limit).all()
    return products

@router.get("/{product_id}", response_model=ProductResponse)
async def read_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/slug/{slug}", response_model=ProductResponse)
async def read_product_by_slug(slug: str, db: Session = Depends(get_db)):
    """Get a specific product by slug"""
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new product (admin only)"""
    # Check if slug already exists
    db_product = db.query(Product).filter(Product.slug == product.slug).first()
    if db_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already in use"
        )
    
    # Create product
    db_product = Product(
        name=product.name,
        slug=product.slug,
        description=product.description,
        price=product.price,
        sale_price=product.sale_price,
        stock=product.stock,
        is_active=product.is_active
    )
    
    # Add categories
    if product.category_ids:
        categories = db.query(Category).filter(Category.id.in_(product.category_ids)).all()
        if len(categories) != len(product.category_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more category IDs are invalid"
            )
        db_product.categories = categories
    
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Add images
    for image_data in product.images:
        db_image = ProductImage(
            product_id=db_product.id,
            image_url=image_data.image_url,
            alt_text=image_data.alt_text,
            is_primary=image_data.is_primary
        )
        db.add(db_image)
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a product (admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if slug is being changed and if it's already in use
    if product_update.slug is not None and product_update.slug != db_product.slug:
        existing_product = db.query(Product).filter(Product.slug == product_update.slug).first()
        if existing_product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Slug already in use"
            )
    
    # Update product fields
    update_data = product_update.model_dump(exclude_unset=True)
    
    # Handle category IDs separately
    category_ids = update_data.pop("category_ids", None)
    
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    # Update categories if provided
    if category_ids is not None:
        categories = db.query(Category).filter(Category.id.in_(category_ids)).all()
        if len(categories) != len(category_ids):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="One or more category IDs are invalid"
            )
        db_product.categories = categories
    
    db.commit()
    db.refresh(db_product)
    return db_product

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete or deactivate a product (admin only)"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Instead of deleting, just mark as inactive
    db_product.is_active = False
    db.commit()
    return None

# Product reviews
@router.post("/{product_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_product_review(
    product_id: int,
    review: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a review for a product"""
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if user already reviewed this product
    existing_review = db.query(Review).filter(
        Review.product_id == product_id,
        Review.user_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already reviewed this product"
        )
    
    # Create review
    db_review = Review(
        product_id=product_id,
        user_id=current_user.id,
        rating=review.rating,
        comment=review.comment
    )
    
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    
    # Include user data in response
    setattr(db_review, "user", current_user)
    return db_review

@router.get("/{product_id}/reviews", response_model=List[ReviewResponse])
async def read_product_reviews(
    product_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get all reviews for a product"""
    # Check if product exists
    product = db.query(Product).filter(Product.id == product_id, Product.is_active == True).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Get reviews with user data
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(
        Review.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return reviews

@router.put("/{product_id}/reviews/{review_id}", response_model=ReviewResponse)
async def update_product_review(
    product_id: int,
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a review for a product"""
    # Check if review exists and belongs to current user
    db_review = db.query(Review).filter(
        Review.id == review_id,
        Review.product_id == product_id,
        Review.user_id == current_user.id
    ).first()
    
    if db_review is None:
        raise HTTPException(status_code=404, detail="Review not found or you don't have permission to edit it")
    
    # Update review fields
    for field, value in review_update.model_dump(exclude_unset=True).items():
        setattr(db_review, field, value)
    
    db.commit()
    db.refresh(db_review)
    
    # Include user data in response
    setattr(db_review, "user", current_user)
    return db_review

@router.delete("/{product_id}/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product_review(
    product_id: int,
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a review for a product"""
    # Check if review exists and belongs to current user, or user is admin
    query = db.query(Review).filter(
        Review.id == review_id,
        Review.product_id == product_id
    )
    
    if not current_user.is_admin:
        query = query.filter(Review.user_id == current_user.id)
    
    db_review = query.first()
    
    if db_review is None:
        raise HTTPException(status_code=404, detail="Review not found or you don't have permission to delete it")
    
    db.delete(db_review)
    db.commit()
    return None

# Categories
@router.get("/categories/all", response_model=List[CategoryResponse])
async def read_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    return db.query(Category).all() 