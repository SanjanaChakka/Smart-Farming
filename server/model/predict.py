import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
import numpy as np
import os
import sys
from tensorflow.keras.preprocessing import image

# Load model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "plant_disease_model.h5")

model = tf.keras.models.load_model(model_path)
train_dir = os.path.join(BASE_DIR, "dataset", "train")
class_names = sorted(os.listdir(train_dir))

def predict_image(img_path):
    img = image.load_img(img_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0

    predictions = model.predict(img_array,  verbose=0)
    predicted_class = class_names[np.argmax(predictions)]

    return predicted_class

if __name__ == "__main__":
    img_path = sys.argv[1]  # image path from Node
    result = predict_image(img_path)
    print(result)