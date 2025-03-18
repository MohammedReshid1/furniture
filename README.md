# Furniture Haven E-commerce

A modern e-commerce platform for furniture shopping, built with Next.js, FastAPI, and SQLAlchemy.

## Project Structure

- `/app` - Next.js frontend application
- `/backend` - FastAPI backend application
- `/public` - Static assets for the frontend

## Features

- Responsive UI with dark/light mode
- User authentication and profile management
- Product browsing and filtering
- Shopping cart functionality
- Order management
- Admin dashboard (for product, order, and user management)
- RESTful API with OpenAPI documentation

## Prerequisites

- Node.js 18+
- Python 3.9+
- Docker and Docker Compose (optional, for containerized setup)

## Setup Instructions

### Option 1: Running with Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd furniture-haven
```

2. Start the application using Docker Compose:

```bash
docker-compose up
```

This will start both the frontend and backend services. Access the frontend at http://localhost:3000 and the API documentation at http://localhost:8000/docs.

### Option 2: Manual Setup

#### Frontend Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000.

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Start the backend server:

```bash
python run.py
```

The backend API will be available at http://localhost:8000 with API documentation at http://localhost:8000/docs.

## Default Users

The system is initialized with two default users:

1. Admin User:
   - Email: admin@example.com
   - Password: adminpassword

2. Test User:
   - Email: user@example.com
   - Password: userpassword

## Development

- Frontend uses Next.js with Tailwind CSS for styling
- API documentation is available through Swagger UI at http://localhost:8000/docs
- SQLite is used as the database for simplicity in development

## Deployment

For production deployment:

1. Update the `SECRET_KEY` in the backend's environment variables
2. Consider using a production-grade database like PostgreSQL
3. Set up proper HTTPS with a valid SSL certificate
4. Configure appropriate CORS settings in the backend

## License

[MIT](LICENSE)
