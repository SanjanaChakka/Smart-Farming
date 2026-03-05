import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import json

# Paths
train_dir = "dataset/train"
val_dir = "dataset/val"

img_size = (128,128)
batch_size = 32

# Load dataset
train_data = tf.keras.preprocessing.image_dataset_from_directory(
    train_dir,
    image_size=img_size,
    batch_size=batch_size
)

val_data = tf.keras.preprocessing.image_dataset_from_directory(
    val_dir,
    image_size=img_size,
    batch_size=batch_size
)

class_names = train_data.class_names
print("Classes:", class_names)

# Save class names
with open("class_names.json","w") as f:
    json.dump(class_names,f)

# Prefetch for performance
AUTOTUNE = tf.data.AUTOTUNE
train_data = train_data.prefetch(buffer_size=AUTOTUNE)
val_data = val_data.prefetch(buffer_size=AUTOTUNE)

# Load pretrained MobileNetV2
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(128,128,3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

# Model
model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation="relu"),
    layers.Dropout(0.5),
    layers.Dense(len(class_names), activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# Train
history = model.fit(
    train_data,
    validation_data=val_data,
    epochs=10
)

# Save model
model.save("plant_disease_model.h5")

print("Model trained and saved successfully!")