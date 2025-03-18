from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, CartItem, Product
from ..schemas import CartItemCreate, CartItemResponse, CartItemUpdate
from ..utils.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[CartItemResponse])
async def read_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get the current user's cart items"""
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    return cart_items

@router.post("/", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED)
async def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Add a product to the cart"""
    # Check if product exists and is active
    product = db.query(Product).filter(
        Product.id == item.product_id,
        Product.is_active == True
    ).first()
    
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Check if product is in stock
    if product.stock < item.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough stock available. Only {product.stock} items left."
        )
    
    # Check if product is already in cart
    existing_item = db.query(CartItem).filter(
        CartItem.user_id == current_user.id,
        CartItem.product_id == item.product_id
    ).first()
    
    if existing_item:
        # Update quantity instead of creating new item
        new_quantity = existing_item.quantity + item.quantity
        
        if new_quantity > product.stock:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot add more items. Only {product.stock} items in stock and you already have {existing_item.quantity} in your cart."
            )
        
        existing_item.quantity = new_quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item
    
    # Create new cart item
    db_item = CartItem(
        user_id=current_user.id,
        product_id=item.product_id,
        quantity=item.quantity
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.put("/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: int,
    item_update: CartItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update the quantity of a cart item"""
    # Get cart item
    db_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if db_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    # Check if product is active and has enough stock
    product = db.query(Product).filter(
        Product.id == db_item.product_id,
        Product.is_active == True
    ).first()
    
    if product is None:
        raise HTTPException(status_code=404, detail="Product no longer available")
    
    if product.stock < item_update.quantity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Not enough stock available. Only {product.stock} items left."
        )
    
    # Update quantity
    db_item.quantity = item_update.quantity
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Remove an item from the cart"""
    db_item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.user_id == current_user.id
    ).first()
    
    if db_item is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    
    db.delete(db_item)
    db.commit()
    return None

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Clear the entire cart"""
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    db.commit()
    return None 