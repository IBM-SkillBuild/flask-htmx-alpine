#!/bin/bash
set -e  # Exit on any error

echo "=== Starting build process ==="
python --version
pip --version

echo "=== Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== Installing core dependencies ==="
python -m pip install -r requirements-minimal.txt

echo "=== Installing OCR dependencies ==="
python -m pip install Pillow==10.0.1
python -m pip install pytesseract==0.3.10

echo "=== Installing Tesseract binary (alternative approach) ==="
python -m pip install tesseract-ocr==5.3.3 || echo "⚠️ tesseract-ocr package not available, trying alternative..."
python -m pip install tesserocr==2.6.2 || echo "⚠️ tesserocr not available, continuing..."

echo "=== Verifying installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')"
python -c "import gunicorn; print(f'✓ Gunicorn installed')"
python -c "import flask_mail; print('✓ Flask-Mail installed')"
python -c "import PIL; print(f'✓ Pillow installed')"
python -c "import pytesseract; print('✓ pytesseract installed')"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="