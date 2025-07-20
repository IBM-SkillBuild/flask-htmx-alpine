#!/bin/bash
set -e  # Exit on any error

echo "=== Starting build process ==="

# Show Python version
python --version
pip --version

echo "=== Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== Installing dependencies ==="
python -m pip install -r requirements.txt

echo "=== Verifying installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')" || echo "✗ Flask installation failed"
python -c "import gunicorn; print(f'✓ Gunicorn installed')" || echo "✗ Gunicorn installation failed"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="