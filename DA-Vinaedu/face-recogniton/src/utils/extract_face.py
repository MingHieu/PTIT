import cv2
import numpy as np

IMG_HEIGHT, IMG_WIDTH = 160, 160

face_classifier = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def extract_face(image, minSize=(60, 60)):
    gray_image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY).astype(np.uint8)
    faces = face_classifier.detectMultiScale(
        gray_image, scaleFactor=1.1, minNeighbors=5, minSize=minSize)
    if len(faces) > 0:
        x, y, w, h = faces[-1]
        face = image[y:y+h, x:x+w]
        face_resized = cv2.resize(face, (IMG_HEIGHT, IMG_WIDTH))
        return face_resized
    return None
