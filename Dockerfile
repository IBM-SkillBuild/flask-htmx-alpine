# Etapa de construcción
FROM python:3.11-slim AS builder
WORKDIR /app
# Instalar dependencias del sistema necesarias para easyocr
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*
# Actualizar pip y copiar requirements.txt
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
COPY requirements.txt .
# Instalar dependencias Python
RUN pip install --no-cache-dir --verbose -r requirements.txt

# Etapa final
FROM python:3.11-slim
WORKDIR /app
# Copiar dependencias instaladas desde la etapa de construcción
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
# Instalar solo las dependencias mínimas del sistema en la imagen final
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*
# Copiar el código de la aplicación
COPY . .
# Crear directorios necesarios
RUN mkdir -p static/images templates uploads
# Configurar variables de entorno
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=8080
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
# Crear usuario no root
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app
# Exponer puerto
EXPOSE 8080
# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:$PORT/health || exit 1
# Iniciar la aplicación
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "--workers", "1", "--threads", "2", "--timeout", "30", "app:app"]