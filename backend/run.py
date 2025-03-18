import uvicorn
import os
import sys
import asyncio
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
env_path = Path(".") / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    print("Warning: .env file not found. Using default values.")

# Try to initialize the database with sample data
try:
    from app.init_db import init_db
    print("Initializing database with sample data...")
    init_db()
    print("Database initialization completed successfully.")
except Exception as e:
    print(f"Error initializing database: {e}")
    print("The application will continue, but some features may not work correctly.")

if __name__ == "__main__":
    try:
        # Get port from environment variable or use default port 8000
        port = int(os.environ.get("PORT", 8000))
        
        print(f"Starting Furniture Haven API on port {port}...")
        print(f"API documentation will be available at http://localhost:{port}/docs")
        
        # Start the FastAPI application with hot reloading for development
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=port,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\nShutting down server...")
        sys.exit(0)
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1) 