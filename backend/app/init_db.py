import os
import sys
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from .models import User, Category, Product, ProductImage
from .utils.auth import get_password_hash
from datetime import datetime

# Admin and test user credentials from environment variables
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "adminpassword")
TEST_USER_EMAIL = os.environ.get("TEST_USER_EMAIL", "user@example.com")
TEST_USER_PASSWORD = os.environ.get("TEST_USER_PASSWORD", "userpassword")

# Add sample data
async def seed_data():
    # Import here to avoid circular imports
    from .database import init_db
    await init_db()
    
    try:
        # Create admin user if it doesn't exist
        admin_user = await User.find_one({"email": ADMIN_EMAIL})
        if not admin_user:
            admin_user = User(
                email=ADMIN_EMAIL,
                full_name="Admin User",
                hashed_password=get_password_hash(ADMIN_PASSWORD),
                is_admin=True
            )
            await admin_user.insert()
            print("Admin user created")
        else:
            print("Admin user already exists")
        
        # Create test user if it doesn't exist
        test_user = await User.find_one({"email": TEST_USER_EMAIL})
        if not test_user:
            test_user = User(
                email=TEST_USER_EMAIL,
                full_name="Test User",
                hashed_password=get_password_hash(TEST_USER_PASSWORD),
                is_admin=False
            )
            await test_user.insert()
            print("Test user created")
        else:
            print("Test user already exists")
        
        # Create categories if they don't exist
        categories = {
            "living-room": "Living Room",
            "bedroom": "Bedroom",
            "office": "Office",
            "kitchen": "Kitchen"
        }
        
        created_categories = {}
        
        for slug, name in categories.items():
            category = await Category.find_one({"slug": slug})
            if not category:
                category = Category(
                    name=name,
                    slug=slug,
                    description=f"Furniture for your {name.lower()}",
                    image_url=f"https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                )
                await category.insert()
                print(f"Category '{name}' created")
            else:
                print(f"Category '{name}' already exists")
            
            created_categories[slug] = category
        
        # Create sample products if they don't exist
        sample_products = [
            {
                "name": "Modern Sofa",
                "slug": "modern-sofa",
                "description": "A comfortable and stylish sofa perfect for any living room.",
                "price": 899.99,
                "stock": 10,
                "categories": ["living-room"],
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": True
                    },
                    {
                        "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": False
                    }
                ]
            },
            {
                "name": "Ergonomic Office Chair",
                "slug": "ergonomic-office-chair",
                "description": "Experience ultimate comfort with our ergonomic office chair designed for long work hours.",
                "price": 299.99,
                "stock": 15,
                "categories": ["office"],
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": True
                    },
                    {
                        "image_url": "https://images.unsplash.com/photo-1589384267710-7a170981ca78?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": False
                    }
                ]
            },
            {
                "name": "Wooden Coffee Table",
                "slug": "wooden-coffee-table",
                "description": "A beautiful solid wood coffee table to complement your living room.",
                "price": 199.99,
                "stock": 8,
                "categories": ["living-room"],
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": True
                    }
                ]
            },
            {
                "name": "Modern Bookshelf",
                "slug": "modern-bookshelf",
                "description": "A spacious bookshelf with a modern design perfect for your books and decor.",
                "price": 249.99,
                "stock": 5,
                "categories": ["living-room", "office"],
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1593085260707-5377ba37f868?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": True
                    }
                ]
            },
            {
                "name": "King Size Bed Frame",
                "slug": "king-size-bed-frame",
                "description": "A sturdy and elegant king size bed frame for your bedroom.",
                "price": 599.99,
                "stock": 3,
                "categories": ["bedroom"],
                "images": [
                    {
                        "image_url": "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600&q=80",
                        "is_primary": True
                    }
                ]
            }
        ]
        
        for product_data in sample_products:
            product = await Product.find_one({"slug": product_data["slug"]})
            if not product:
                # Get category IDs
                category_ids = []
                for category_slug in product_data["categories"]:
                    if category_slug in created_categories:
                        category_ids.append(created_categories[category_slug].id)
                
                # Create product
                product = Product(
                    name=product_data["name"],
                    slug=product_data["slug"],
                    description=product_data["description"],
                    price=product_data["price"],
                    stock=product_data["stock"],
                    category_ids=category_ids
                )
                await product.insert()
                
                # Add images
                for image_data in product_data["images"]:
                    image = ProductImage(
                        product_id=product.id,
                        image_url=image_data["image_url"],
                        is_primary=image_data.get("is_primary", False),
                        alt_text=product_data["name"]
                    )
                    await image.insert()
                
                print(f"Product '{product_data['name']}' created")
            else:
                print(f"Product '{product_data['name']}' already exists")
        
        print("Database initialized successfully")
    
    except Exception as e:
        print(f"Error initializing database: {e}", file=sys.stderr)

def init_db():
    """Function to run the async seed_data from sync code"""
    loop = asyncio.get_event_loop()
    loop.run_until_complete(seed_data())

if __name__ == "__main__":
    init_db() 