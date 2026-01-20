#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Optionally, create a superuser or initial data (only if needed and idempotent)
# python manage.py createsuperuser --noinput || true