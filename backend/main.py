from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
from typing import List

app = FastAPI(title='SPK Jantung API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictInput(BaseModel):
    age: float
    sex: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float

# Load model with error handling
try:
    model = joblib.load('model.joblib')
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.get('/')
def read_root():
    return {'message': 'SPK Jantung API Ready'}

@app.post('/predict')
def predict(input_data: PredictInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    features = np.array([[input_data.age, input_data.sex, input_data.trestbps, input_data.chol,
                          input_data.fbs, input_data.restecg, input_data.thalach]])
    pred = model.predict(features)[0]
    prob = model.predict_proba(features)[0]
    risk = 'High' if pred == 1 else 'Low'
    return {
        'risk': risk,
        'probability': {'low': prob[0], 'high': prob[1]},
        'advice': 'Konsultasi dokter jika high risk!'
    }

@app.get('/metrics')
def metrics():
    return {'accuracy': 0.60, 'precision': 0.50, 'recall': 0.67}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='0.0.0.0', port=8000)
