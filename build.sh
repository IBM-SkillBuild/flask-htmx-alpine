#!/bin/bash
set -e  # Exit on any error

echo "=== Starting build process ==="

# Show Python version
python --version
pip --version

echo "=== Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== Installing minimal dependencies first ==="
python -m pip install -r requirements-minimal.txt

echo "=== Installing optional dependencies ==="
python -m pip install Pillow==10.0.1 || echo "⚠️ Pillow installation failed, continuing..."
python -m pip install pytesseract==0.3.10 || echo "⚠️ pytesseract installation failed, continuing..."

echo "=== Verifying core installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')"
python -c "import gunicorn; print(f'✓ Gunicorn installed')"
python -c "import flask_mail; print('✓ Flask-Mail installed')"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="