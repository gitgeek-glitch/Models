from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os

app = Flask(__name__, static_url_path='/static', static_folder='uploads')
CORS(app)

# Load models
try:
    inception_model = tf.keras.models.load_model("C:\\Users\\sehar\\OneDrive\\Desktop\\models\\InceptionV3_FireDetection.h5")
    alexnet_model = tf.keras.models.load_model("C:\\Users\\sehar\\OneDrive\\Desktop\\models\\AlexNet_FireDetection.h5")
except Exception as e:
    print("Error loading models:", e)
    exit(1)

# Define class labels
class_labels = ['Fire', 'Neutral', 'Smoke']

# Ensure the 'uploads' folder exists
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "Fire Detection API with Static File Support is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    try:
        file.save(filepath)
        print(f"File saved to: {filepath}")

        # Preprocess the image
        image = load_img(filepath, target_size=(224, 224))
        image_array = img_to_array(image)
        image_array = np.expand_dims(image_array, axis=0) / 255.0  # Normalize

        # Get predictions from models
        inception_pred = inception_model.predict(image_array)[0]
        alexnet_pred = alexnet_model.predict(image_array)[0]

        # Ensemble prediction (average)
        ensemble_pred = (inception_pred + alexnet_pred) / 2
        predicted_class = class_labels[np.argmax(ensemble_pred)]
        # Prepare response
        response = {
            "InceptionV3_Probabilities": inception_pred.tolist(),
            "AlexNet_Probabilities": alexnet_pred.tolist(),
            "Average_Probabilities": ensemble_pred.tolist(),
            "Prediction": predicted_class,
            "FilePath": f"/static/{file.filename}"
        }

        return jsonify(response)

    except Exception as e:
        print("Error during prediction:", e)
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5003)
