import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
import numpy as np
import sys
import json
from tensorflow.keras.preprocessing import image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model
model = tf.keras.models.load_model(os.path.join(BASE_DIR,"plant_disease_model.h5"))

# Load class names
with open(os.path.join(BASE_DIR,"class_names.json")) as f:
    class_names = json.load(f)


def predict_image(img_path):

    img = image.load_img(img_path,target_size=(128,128))
    img_array = image.img_to_array(img)

    img_array = np.expand_dims(img_array,axis=0)
    img_array = img_array/255.0

    predictions = model.predict(img_array,verbose=0)

    predicted_index = np.argmax(predictions)

    predicted_class = class_names[predicted_index]

    confidence = float(predictions[0][predicted_index])

    return predicted_class,confidence


if __name__ == "__main__":

    img_path = sys.argv[1]

    predicted,confidence = predict_image(img_path)

    # Non plant filter
    if confidence < 0.60:
        result = {
            "error":"Please upload a clear plant leaf image"
        }

        print(json.dumps(result))
        sys.exit()

    parts = predicted.split("_")

    crop = parts[0]
    disease = " ".join(parts[1:])

    status = "Healthy" if "healthy" in predicted.lower() else "Diseased"

    result = {
        "crop": crop,
        "disease": disease,
        "confidence": round(confidence*100,2),
        "status": status
    }

    print(json.dumps(result))