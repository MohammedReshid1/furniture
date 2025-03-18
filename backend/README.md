# Furniture Haven API

This is the backend API for the Furniture Haven e-commerce website. It is built with FastAPI and SQLAlchemy.

## Features

- User authentication with JWT tokens
- Product management
- Shopping cart functionality
- Order processing
- Product categories
- Product reviews
- User profiles and addresses

## Setup Instructions

### Prerequisites

- Python 3.9+
- pip

### Installation

1. Create a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the server:

```bash
python run.py
```

The server will start at http://localhost:8000.

### API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Default Users

The system is initialized with two default users:

1. Admin User:
   - Email: admin@example.com
   - Password: adminpassword

2. Test User:
   - Email: user@example.com
   - Password: userpassword

## API Endpoints

### Authentication

- POST /api/register - Register a new user
- POST /api/login - Login to get access token

### Users

- GET /api/users/me - Get current user profile
- PUT /api/users/me - Update current user profile
- POST /api/users/me/addresses - Add a new address
- GET /api/users/me/addresses - Get all user addresses
- GET /api/users/me/addresses/{id} - Get a specific address
- PUT /api/users/me/addresses/{id} - Update an address
- DELETE /api/users/me/addresses/{id} - Delete an address

### Products

- GET /api/products - Get all products with filtering options
- GET /api/products/{id} - Get a specific product
- GET /api/products/slug/{slug} - Get a product by slug
- POST /api/products - Create a new product (admin only)
- PUT /api/products/{id} - Update a product (admin only)
- DELETE /api/products/{id} - Delete a product (admin only)

### Reviews

- GET /api/products/{id}/reviews - Get all reviews for a product
- POST /api/products/{id}/reviews - Create a review for a product
- PUT /api/products/{id}/reviews/{review_id} - Update a review
- DELETE /api/products/{id}/reviews/{review_id} - Delete a review

### Cart

- GET /api/cart - Get current user's cart
- POST /api/cart - Add a product to cart
- PUT /api/cart/{id} - Update cart item quantity
- DELETE /api/cart/{id} - Remove item from cart
- DELETE /api/cart - Clear cart

### Orders

- POST /api/orders - Create a new order
- GET /api/orders - Get all user orders
- GET /api/orders/{id} - Get a specific order
- PUT /api/orders/{id}/cancel - Cancel an order
- PUT /api/orders/{id}/status - Update order status (admin only)
- GET /api/orders/admin/all - Get all orders (admin only) 