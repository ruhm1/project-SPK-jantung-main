import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix, ConfusionMatrixDisplay
from sklearn.preprocessing import LabelEncoder
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Load dataset
df = pd.read_csv('../dataset/heart_raw.data', names=['age','sex','cp','trestbps','chol','fbs','restecg','thalach','exang','oldpeak','slope','ca','thal','target'], na_values='?')
df = df.dropna()
df['target'] = pd.to_numeric(df['target'], errors='coerce')
df = df.dropna(subset=['target'])
df['target'] = (df['target'] > 0).astype(int)

# Select features per skripsi
features = ['age', 'sex', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach']
X = df[features]
y = (df['target'] > 0).astype(int)  # Binary: 0 normal, 1 risk

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Decision Tree
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)

print(f'Accuracy: {accuracy:.2f}')
print(f'Precision: {precision:.2f}')
print(f'Recall: {recall:.2f}')

# Save model first
joblib.dump(model, 'model.joblib')
print('Model saved.')

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap='Blues')
plt.title('Confusion Matrix - Decision Tree')
plt.savefig('confusion_matrix.png')
# plt.show() # Comment to avoid block
print('Plot saved.')
