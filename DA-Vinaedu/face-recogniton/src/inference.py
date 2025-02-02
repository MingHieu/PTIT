import os
import numpy as np
from io import BytesIO
from PIL import Image
from keras.models import load_model
from keras.utils import img_to_array
from keras.ops import norm
from .utils.extract_face import extract_face
from .utils.euclidean_distance import euclidean_distance

IMG_HEIGHT, IMG_WIDTH = 160, 160

current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, 'models', 'face_embedding.h5')

model = load_model(model_path, custom_objects={
    'euclidean_distance': euclidean_distance},
    compile=False)
embedding_model = model.layers[2]


def process_img(image_file):
    img = Image.open(BytesIO(image_file.read()))
    img = img.convert('RGB')
    img = img.resize((IMG_HEIGHT, IMG_WIDTH))
    img = img_to_array(img)
    img = extract_face(img)
    if img is not None:
        img = np.expand_dims(img, axis=0)
        return img
    return None


def compare_faces(file1, file2, threshold=0.4):
    img_1 = process_img(file1)
    img_2 = process_img(file2)
    if img_1 is None or img_2 is None:
        raise ValueError("Không nhận diện được khuôn mặt")
    embedding1 = embedding_model.predict(img_1)
    embedding2 = embedding_model.predict(img_2)
    distance = norm(embedding1 - embedding2).numpy()
    return bool(distance < threshold)


def detect_face_from_file(file):
    img = Image.open(BytesIO(file.read()))
    img = img.convert('RGB')
    img = img.resize((IMG_HEIGHT, IMG_WIDTH))
    img = img_to_array(img)
    img = extract_face(img)
    return img is not None
