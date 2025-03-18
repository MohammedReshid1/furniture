from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Address
from ..schemas import UserResponse, UserUpdate, AddressCreate, AddressResponse, AddressUpdate
from ..utils.auth import get_current_active_user, get_password_hash
from typing import List

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_active_user)):
    """Get current user profile"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update current user profile"""
    if user_update.email is not None:
        # Check if email already exists for another user
        db_user = db.query(User).filter(User.email == user_update.email).first()
        if db_user and db_user.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        current_user.email = user_update.email
    
    if user_update.full_name is not None:
        current_user.full_name = user_update.full_name
    
    if user_update.password is not None:
        current_user.hashed_password = get_password_hash(user_update.password)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/addresses", response_model=AddressResponse, status_code=status.HTTP_201_CREATED)
async def create_user_address(
    address: AddressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new address for current user"""
    # If this is the default address, remove default from other addresses
    if address.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.is_default == True
        ).update({"is_default": False})
    
    # Create new address
    db_address = Address(**address.model_dump(), user_id=current_user.id)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

@router.get("/me/addresses", response_model=List[AddressResponse])
async def read_user_addresses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all addresses for current user"""
    return db.query(Address).filter(Address.user_id == current_user.id).all()

@router.get("/me/addresses/{address_id}", response_model=AddressResponse)
async def read_user_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get a specific address for current user"""
    db_address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if db_address is None:
        raise HTTPException(status_code=404, detail="Address not found")
    
    return db_address

@router.put("/me/addresses/{address_id}", response_model=AddressResponse)
async def update_user_address(
    address_id: int,
    address_update: AddressUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Update a specific address for current user"""
    db_address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if db_address is None:
        raise HTTPException(status_code=404, detail="Address not found")
    
    # Update address fields
    for field, value in address_update.model_dump(exclude_unset=True).items():
        setattr(db_address, field, value)
    
    # If this is being set as default, remove default from other addresses
    if address_update.is_default:
        db.query(Address).filter(
            Address.user_id == current_user.id,
            Address.id != address_id,
            Address.is_default == True
        ).update({"is_default": False})
    
    db.commit()
    db.refresh(db_address)
    return db_address

@router.delete("/me/addresses/{address_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Delete a specific address for current user"""
    db_address = db.query(Address).filter(
        Address.id == address_id,
        Address.user_id == current_user.id
    ).first()
    
    if db_address is None:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(db_address)
    db.commit()
    return None 