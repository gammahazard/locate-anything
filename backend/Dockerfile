# LocateAnything-3B backend — CUDA runtime + PyTorch + FastAPI.
# CUDA 12.8 so we get native kernels for the full supported GPU range:
# Ampere (RTX 30xx, A100), Lovelace (RTX 40xx), Hopper (H100), and
# Blackwell (RTX 50xx) — sm_120 has no kernels in older cu124 builds.
FROM nvidia/cuda:13.2.1-cudnn-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    LA_DATA_DIR=/data \
    HF_HOME=/hf_cache

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-dev build-essential git \
    libgl1 libglib2.0-0 \
    && ln -sf /usr/bin/python3 /usr/bin/python \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# PyTorch for CUDA 12.8 (installed separately from the CUDA wheel index, per
# the model card). cu128 wheels carry native kernels through sm_120 (Blackwell).
RUN pip3 install --upgrade pip \
    && pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu128

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
