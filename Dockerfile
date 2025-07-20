# Etapa de construcción
FROM python:3.11-alpine AS builder
WORKDIR /app
# Instalar solo dependencias necesarias para compilar paquetes de Python
RUN apk add --no-cache \
    build-base \
    libpng-dev \
    freetype-dev \
    libstdc++
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
RUN pip install --no-cache-dir --verbose -r requirements.txt

# Etapa final
FROM python:3.11-alpine
WORKDIR /app
# Instalar solo las dependencias mínimas del sistema para pytesseract
RUN apk add --no-cache \
    tesseract-ocr \
    libpng \
    freetype \
    libstdc++ \
    && rm -rf /var/cache/apk/*
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .
RUN mkdir -p static/images templates uploads
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=8080
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
RUN adduser -D app && chown -R app:app /app
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget -qO- http://localhost:$PORT/health || exit 1
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "2", "--timeout", "30", "app:app"]