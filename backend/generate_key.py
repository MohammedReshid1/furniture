#!/usr/bin/env python3
"""
Utility script to generate a secure secret key for JWT authentication.
"""

import secrets
import base64

def generate_secret_key(length=32):
    """Generate a secure random key of specified length."""
    # Generate random bytes
    random_bytes = secrets.token_bytes(length)
    # Convert to base64 for a string representation
    base64_string = base64.urlsafe_b64encode(random_bytes).decode('utf-8')
    # Remove any trailing = padding characters
    return base64_string.rstrip('=')

def generate_env_format():
    """Generate a key ready to paste into .env file."""
    key = generate_secret_key(64)  # 64 bytes = 512 bits, very secure
    return f"SECRET_KEY={key}"

if __name__ == "__main__":
    print("\nGenerated secure secret key for JWT authentication:\n")
    print(generate_env_format())
    print("\nCopy this line to your .env file to use it.\n")
    print("IMPORTANT: Keep this key secret and don't share it publicly!\n") 