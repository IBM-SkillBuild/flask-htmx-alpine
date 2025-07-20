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

echo "=== Installing OCR dependencies (without system Tesseract) ==="
python -m pip install Pillow==10.0.1

echo "=== Installing EasyOCR as Tesseract alternative ==="
python -m pip install easyocr==1.7.0 || echo "⚠️ EasyOCR installation failed, continuing..."

echo "=== Verifying installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')"
python -c "import gunicorn; print(f'✓ Gunicorn installed')"
python -c "import flask_mail; print('✓ Flask-Mail installed')"
python -c "import PIL; print(f'✓ Pillow installed')"

echo "=== Testing OCR alternatives ==="
python -c "import easyocr; print('✓ EasyOCR available')" || echo "⚠️ EasyOCR not available"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="