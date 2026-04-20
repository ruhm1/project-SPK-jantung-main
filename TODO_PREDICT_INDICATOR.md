# Predict Page - Add Indicators for Limited Options

## Info
- **sex**: radio Male(1)/Female(0) ✓ indicated
- **fbs**: number 0/1 → select [No, Yes] needed
- **restecg**: number 0/1/2 → select [Normal, ST, LVH] needed
- **exang**: missing field? Add
- **slope**, **ca**, **thal**: missing fields

## Plan
1. Add missing UCI fields (exang, slope, ca, thal)
2. Convert categorical to selects with **visual indicators** (icons, colors, tooltips)
3. Update validation
4. Test backend compatibility
5. Complete


