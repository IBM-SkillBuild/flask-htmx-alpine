#!/bin/bash
set -e  # Exit on any error

echo "=== Starting build process ==="

# Show Python version
python --version
pip --version

echo "=== Installing system dependencies for OCR ==="
apt-get update
apt-get install -y tesseract-ocr tesseract-ocr-eng tesseract-ocr-spa libtesseract-dev

echo "=== Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== Installing minimal dependencies first ==="
python -m pip install -r requirements-minimal.txt

echo "=== Installing OCR dependencies ==="
python -m pip install Pillow==10.0.1
python -m pip install pytesseract==0.3.10

echo "=== Verifying all installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')"
python -c "import gunicorn; print(f'✓ Gunicorn installed')"
python -c "import flask_mail; print('✓ Flask-Mail installed')"
python -c "import PIL; print(f'✓ Pillow installed')"
python -c "import pytesseract; print('✓ pytesseract installed')"

echo "=== Testing Tesseract ==="
tesseract --version || echo "⚠️ Tesseract not found in PATH"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="