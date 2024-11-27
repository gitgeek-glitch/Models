from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
import os

app = Flask(__name__, static_url_path='/static', static_folder='uploads')

# Enable CORS for all routes and origins (you can customize it later)
CORS(app)


# Load the model
model = tf.keras.models.load_model("C:\\Users\\sehar\\OneDrive\\Desktop\\models\\InceptionV3_FireDetection.h5")

# Define class labels
class_labels = ['Fire', 'Neutral', 'Smoke']

# Ensure the 'uploads' folder exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/')
def home():
    return "Fire Detection API is Running!"

@app.route('/predict', methods=['POST'])
def predict():
    # Ensure the file is saved before trying to remove it
    file = request.files['file']
    filepath = os.path.join('uploads', file.filename)
    
    # Save the file to the 'uploads' folder
    file.save(filepath)
    print(f"File saved to: {filepath}")  # Debugging output

    # Load and preprocess the image
    image = load_img(filepath, target_size=(224, 224))  # Resize the image to the required input size
    image_array = img_to_array(image)  # Convert image to array
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    image_array /= 255.0  # Normalize image to [0, 1] range
    
    # Predict the class of the image
    prediction = model.predict(image_array)
    predicted_class = class_labels[np.argmax(prediction)]

    # Check if the file exists before trying to delete it
    if os.path.exists(filepath):
        os.remove(filepath)
    else:
        print(f"File {filepath} not found")

    return jsonify({'prediction': predicted_class})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002)
