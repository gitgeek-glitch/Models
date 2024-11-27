import React, { useState } from 'react'
import axios from 'axios'
import { Upload, AlertCircle } from 'lucide-react'

export default function Incept() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [prediction, setPrediction] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const objectUrl = URL.createObjectURL(selectedFile)
      setPreview(objectUrl)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file before submitting.")
      return
    }

    setIsLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post('http://localhost:5002/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setPrediction(response.data.prediction)
    } catch (error) {
      console.error("Error predicting:", error)
      alert("There was an error processing your request.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full transition-all duration-300 ease-in-out transform hover:scale-105">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          InceptionV3: Fire & Smoke Detector
        </h1>
        <div className="space-y-6">
          <div className="relative">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-indigo-600 focus:outline-none"
            >
              <span className="flex items-center space-x-2">
                <Upload className="w-6 h-6 text-indigo-600" />
                <span className="font-medium text-gray-600">
                  Drop files to Attach, or <span className="text-indigo-600 underline">browse</span>
                </span>
              </span>
            </label>
          </div>
          {preview && (
            <div className="relative overflow-hidden rounded-lg aspect-w-16 aspect-h-9">
              <img src={preview} alt="Uploaded Preview" className="object-cover w-full h-full" />
            </div>
          )}
          <button
            className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'
            }`}
            onClick={handleSubmit}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Upload & Predict'
            )}
          </button>
        </div>
        {prediction && (
          <div className={`mt-6 p-4 rounded-md ${
            prediction.toLowerCase() === 'fire' ? 'bg-red-100 text-red-800' : 
            prediction.toLowerCase() === 'smoke' ? 'bg-gray-100 text-gray-800' : 
            'bg-green-100 text-green-800'
          } transition-all duration-300 ease-in-out animate-fade-in-down`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Prediction: {prediction}</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

