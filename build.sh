#!/bin/bash
set -e  # Exit on any error

echo "=== Starting build process ==="
python --version
pip --version

echo "=== Upgrading pip ==="
python -m pip install --upgrade pip

echo "=== Installing all dependencies ==="
python -m pip install -r requirements.txt

echo "=== Verifying installations ==="
python -c "import flask; print(f'✓ Flask {flask.__version__} installed')"
python -c "import gunicorn; print(f'✓ Gunicorn installed')"
python -c "import flask_mail; print('✓ Flask-Mail installed')"
python -c "import PIL; print(f'✓ Pillow installed')"
python -c "import easyocr; print('✓ EasyOCR installed')" || echo "⚠️ EasyOCR not available"

echo "=== Creating directories ==="
mkdir -p static/images templates

echo "=== Build completed successfully! ==="