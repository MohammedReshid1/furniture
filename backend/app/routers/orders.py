from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User, Order, OrderItem, Product, Address, CartItem
from ..schemas import OrderCreate, OrderResponse
from ..utils.auth import get_current_active_user, get_current_admin_user

router = APIRouter()

@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Create a new order"""
    # Check if address exists and belongs to current user
    address = db.query(Address).filter(
        Address.id == order.address_id,
        Address.user_id == current_user.id
    ).first()
    
    if address is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid address or address doesn't belong to current user"
        )
    
    # Validate each order item
    total_amount = 0
    order_items_data = []
    
    for item in order.items:
        product = db.query(Product).filter(
            Product.id == item.product_id,
            Product.is_active == True
        ).first()
        
        if product is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {item.product_id} not found or is inactive"
            )
        
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Not enough stock for product '{product.name}'. Available: {product.stock}, Requested: {item.quantity}"
            )
        
        # Calculate item price (use sale_price if available)
        price = product.sale_price if product.sale_price else product.price
        item_total = price * item.quantity
        total_amount += item_total
        
        order_items_data.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "price": price
        })
        
        # Update stock
        product.stock -= item.quantity
        
    # Create order
    db_order = Order(
        user_id=current_user.id,
        address_id=address.id,
        total_amount=total_amount,
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item_data in order_items_data:
        db_order_item = OrderItem(
            order_id=db_order.id,
            product_id=item_data["product_id"],
            quantity=item_data["quantity"],
            price=item_data["price"]
        )
        db.add(db_order_item)
    
    # Clear the cart (optional - can be controlled by frontend)
    db.query(CartItem).filter(CartItem.user_id == current_user.id).delete()
    
    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=List[OrderResponse])
async def read_user_orders(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get all orders for the current user"""
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(
        Order.created_at.desc()
    ).offset(skip).limit(limit).all()
    return orders

@router.get("/{order_id}", response_model=OrderResponse)
async def read_user_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Get details of a specific order"""
    query = db.query(Order).filter(Order.id == order_id)
    
    # Non-admin users can only view their own orders
    if not current_user.is_admin:
        query = query.filter(Order.user_id == current_user.id)
    
    order = query.first()
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return order

@router.put("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """Cancel an order"""
    query = db.query(Order).filter(Order.id == order_id)
    
    # Non-admin users can only cancel their own orders
    if not current_user.is_admin:
        query = query.filter(Order.user_id == current_user.id)
    
    order = query.first()
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Can only cancel if the order is pending
    if order.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel order with status '{order.status}'"
        )
    
    # Update order status
    order.status = "cancelled"
    
    # Restore stock
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            product.stock += item.quantity
    
    db.commit()
    db.refresh(order)
    return order

@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update order status (admin only)"""
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )
    
    order = db.query(Order).filter(Order.id == order_id).first()
    
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # If changing to cancelled and not already cancelled, restore stock
    if status == "cancelled" and order.status != "cancelled":
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                product.stock += item.quantity
    
    # If changing from cancelled to something else, decrease stock again
    if order.status == "cancelled" and status != "cancelled":
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            if product:
                if product.stock < item.quantity:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Not enough stock to restore order. Product '{product.name}' has {product.stock} items, but {item.quantity} needed."
                    )
                product.stock -= item.quantity
    
    order.status = status
    db.commit()
    db.refresh(order)
    return order

@router.get("/admin/all", response_model=List[OrderResponse])
async def read_all_orders(
    skip: int = 0,
    limit: int = 10,
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all orders (admin only)"""
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    return orders 