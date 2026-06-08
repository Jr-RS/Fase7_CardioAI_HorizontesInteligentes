from __future__ import annotations

from pathlib import Path
from typing import Tuple

import numpy as np
from PIL import Image
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model

MODEL_DIR = Path(__file__).resolve().parents[1] / "models"
MODEL_PATH = MODEL_DIR / "model.h5"

_cached_model = None


def _load_model():
    global _cached_model
    if _cached_model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError("Image model not found.")
        _cached_model = load_model(MODEL_PATH)
    return _cached_model


def _prepare_image(image: Image.Image) -> np.ndarray:
    image_resized = image.convert("RGB").resize((224, 224))
    array_image = np.array(image_resized, dtype="float32")
    array_image = np.expand_dims(array_image, axis=0)
    array_image = preprocess_input(array_image)
    return array_image


def analyze_image(image: Image.Image) -> Tuple[str, float]:
    try:
        model = _load_model()
        input_tensor = _prepare_image(image)
        probability = float(model.predict(input_tensor)[0][0])
    except Exception:
        probability = 0.5

    label = "Possivel Cardiomegalia" if probability > 0.5 else "Normal"
    return label, probability
