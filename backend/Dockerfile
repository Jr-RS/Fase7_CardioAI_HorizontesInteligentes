FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system deps needed for some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libglib2.0-0 \
    libsm6 \
    libxrender1 \
    libxext6 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
# Install dependencies (may include tensorflow-cpu)
RUN pip install -r /app/requirements.txt || pip install --no-deps -r /app/requirements.txt

# Copy application code
COPY . /app

EXPOSE 8000

# O Render injeta a porta via variavel $PORT. Localmente, usa 8000 como padrao.
# Usamos a forma shell do CMD para permitir a expansao da variavel.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
