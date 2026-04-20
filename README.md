# Sistem Pendukung Keputusan (SPK) Risiko Penyakit Jantung Dini

## Overview
Web app modern untuk deteksi dini risiko jantung pakai Decision Tree ML. Dataset UCI Heart Disease. UI aesthetic dengan animasi medis.

## Tech Stack (Latest Versions)
- Backend: Python 3.12, FastAPI 0.115
- ML: scikit-learn 1.5.2
- Frontend: React 19, Tailwind 3.4, Framer Motion 11
- DB: SQLite

## Quick Start
1. Backend:
   ```
   cd backend
   python -m venv venv
   venv\\Scripts\\activate
   pip install -r requirements.txt
   python model.py  # Train model
   uvicorn main:app --reload
   ```
2. Frontend:
   ```
   cd frontend
   npm install
   npm run dev
   ```

## API Endpoints
- POST /predict: JSON {age, sex, trestbps, chol, fbs, restecg, thalach}
- GET /metrics: Accuracy, Precision, Recall

## Dataset
UCI Cleveland: dataset/heart.csv

## Run
Backend: http://localhost:8000
Frontend: http://localhost:5173

