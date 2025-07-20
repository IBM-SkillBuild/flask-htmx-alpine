#!/bin/bash

# Install dependencies with cache optimization
pip install --cache-dir /tmp/pip-cache --upgrade pip
pip install --cache-dir /tmp/pip-cache -r requirements.txt

# Verify gunicorn installation
python -m pip show gunicorn || pip install gunicorn==21.2.0

# Create necessary directories if they don't exist
mkdir -p static/images
mkdir -p templates

# Pre-compile Python files for faster startup
python -m compileall . || echo "Compilation warnings ignored"

# Verify critical files exist
if [ ! -f "app.py" ]; then
    echo "ERROR: app.py not found!"
    exit 1
fi

# Test gunicorn availability
which gunicorn || echo "WARNING: gunicorn not in PATH, will use python -m gunicorn"

echo "Build completed successfully!"