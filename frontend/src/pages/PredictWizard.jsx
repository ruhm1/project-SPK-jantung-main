import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, Send, AlertCircle, Zap, WifiOff, Heart, User, Activity, Droplets, Brain, Stethoscope, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';

function PredictWizard() {
  const { register, handleSubmit, formState: { errors }, control, watch, trigger } = useForm({
    defaultValues: {
      age: '',
      sex: '',
      trestbps: '',
      chol: '',
      fbs: '',
      restecg: '',
      thalach: ''
    }
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const watchedAge = useWatch({ control, name: 'age' });
  const watchedSex = useWatch({ control, name: 'sex' });
  const watchedTrestbps = useWatch({ control, name: 'trestbps' });

  const steps = [
    { id: 0, title: 'Usia', field: 'age', icon: User, min: 20, max: 100, unit: 'tahun' },
    { id: 1, title: 'Jenis Kelamin', field: 'sex', icon: Activity },
    { id: 2, title: 'Tekanan Darah', field: 'trestbps', icon: Droplets, min: 90, max: 250, unit: 'mmHg' },
    { id: 3, title: 'Kolesterol', field: 'chol', icon: HeartPulse, min: 100, max: 600, unit: 'mg/dl' },
    { id: 4, title: 'Gula Darah', field: 'fbs', icon: Brain },
    { id: 5, title: 'EKG', field: 'restecg', icon: Stethoscope },
    { id: 6, title: 'Detak Jantung', field: 'thalach', icon: HeartPulse, min: 70, max: 220, unit: 'bpm' }
  ];

  const nextStep = async () => {
    const fieldsValid = await trigger();
    if (fieldsValid && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/predict', data, { timeout: 10000 });
      setResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Backend tidak jalan. Jalankan: cd backend && python -m uvicorn main:app --reload');
    } finally {
      setLoading(false);
    }
  };

  const getAgeCategory = (age) => {
    const numAge = parseInt(age);
    if (isNaN(numAge)) return 'unknown';
    if (numAge < 30) return 'teen';
    if (numAge < 60) return 'adult';
    return 'elderly';
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl rounded-3xl border border-emerald-500/40 shadow-heart-glow mb-12">
            <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-mono text-xl uppercase tracking-wider">Step {currentStep + 1} dari 7</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent mb-6">
            {step.title}
          </h1>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="glass-card mb-16 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            {steps.map((s, index) => (
              <motion.div
                key={s.id}
                className={`flex flex-col items-center cursor-pointer transition-all p-2 rounded-xl ${index === currentStep ? 'bg-emerald-500/20' : index < currentStep ? 'bg-emerald-400/20 text-emerald-400' : 'text-white/50 hover:text-emerald-300'}`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: index === currentStep ? 1.3 : 1 }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl mb-2 border-3 ${index === currentStep ? 'bg-emerald-500 shadow-heart-glow border-emerald-400' : index < currentStep ? 'bg-emerald-400 border-emerald-400/50' : 'bg-white/10 border-white/30'}`}
                >
                  <s.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-mono uppercase tracking-wide">{s.id + 1}</span>
              </motion.div>
            ))}
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-heart-glow rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: currentStep > 0 ? 50 : -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: currentStep > 0 ? -50 : 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="glass-card p-12"
          >
            {/* Animated Step Icon */}
            <motion.div 
              className="text-center mb-12"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <motion.div 
                className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center shadow-2xl border-4 ${
                  currentStep === 0 && getAgeCategory(watchedAge) === 'teen' ? 'bg-gradient-to-r from-blue-500/30 border-blue-400/50 shadow-blue-glow' :
                  currentStep === 0 && getAgeCategory(watchedAge) === 'adult' ? 'bg-gradient-to-r from-emerald-500/30 border-emerald-400/50 shadow-emerald-glow' :
                  currentStep === 0 && getAgeCategory(watchedAge) === 'elderly' ? 'bg-gradient-to-r from-orange-500/30 border-orange-400/50 shadow-orange-glow' :
                  currentStep === 1 && watchedSex === '1' ? 'bg-gradient-to-r from-blue-500/30 border-blue-400/50 shadow-blue-glow' :
                  currentStep === 1 && watchedSex === '0' ? 'bg-gradient-to-r from-pink-500/30 border-pink-400/50 shadow-pink-glow' :
                  'bg-white/10 border-white/20 shadow-heart-glow'
                }`}
              >
                {currentStep === 0 ? (
                  <User className={`w-20 h-20 animate-bounce ${
                    getAgeCategory(watchedAge) === 'teen' ? 'text-blue-400' :
                    getAgeCategory(watchedAge) === 'adult' ? 'text-emerald-400' :
                    'text-orange-400'
                  }`} />
                ) : currentStep === 1 ? (
                  watchedSex === '1' ? <Activity className="w-20 h-20 text-blue-400 animate-pulse" /> : 
                  watchedSex === '0' ? <User className="w-20 h-20 text-pink-400 animate-pulse" /> :
                  <Activity className="w-20 h-20 text-white/50" />
                ) : (
                  <step.icon className="w-20 h-20 text-emerald-400 animate-pulse" />
                )}
              </motion.div>
            </motion.div>

            {/* Input Field */}
            {step.id === 0 && (
              <div className="text-center space-y-6">
                <motion.input 
                  {...register('age', { required: 'Usia wajib', min: 20, max: 100 })} 
                  type="number" 
                  placeholder="52"
                  className="w-full max-w-lg mx-auto block px-12 py-12 text-4xl font-mono text-white text-center bg-white/10 border-4 border-white/20 rounded-3xl focus:border-emerald-400 focus:ring-8 focus:ring-emerald-500/20 focus:bg-white/20 transition-all duration-300 shadow-2xl hover:shadow-heart-glow"
                  whileFocus={{ scale: 1.02 }}
                />
                {errors.age && <AlertCircle className="w-12 h-12 text-red-400 mx-auto animate-pulse" />}
              </div>
            )}

            {step.id === 1 && (
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                <motion.label className="group cursor-pointer p-8 rounded-3xl border-2 border-white/20 backdrop-blur hover:border-blue-400 hover:bg-blue-500/10 peer-checked:border-blue-400 peer-checked:bg-blue-500/20 peer-checked:shadow-blue-glow peer-checked:scale-105 transition-all duration-300" whileHover={{ scale: 1.02 }}>
                  <input type="radio" value="1" {...register('sex', { required: true })} className="sr-only peer" />
                  <Activity className="w-24 h-24 mx-auto mb-6 text-blue-400 animate-pulse peer-checked:animate-bounce" />
                  <h3 className="text-3xl font-black text-white text-center">Laki-laki</h3>
                </motion.label>
                <motion.label className="group cursor-pointer p-8 rounded-3xl border-2 border-white/20 backdrop-blur hover:border-pink-400 hover:bg-pink-500/10 peer-checked:border-pink-400 peer-checked:bg-pink-500/20 peer-checked:shadow-pink-glow peer-checked:scale-105 transition-all duration-300" whileHover={{ scale: 1.02 }}>
                  <input type="radio" value="0" {...register('sex', { required: true })} className="sr-only peer" />
                  <User className="w-24 h-24 mx-auto mb-6 text-pink-400 animate-pulse peer-checked:animate-bounce" />
                  <h3 className="text-3xl font-black text-white text-center">Perempuan</h3>
                </motion.label>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-6 justify-center pt-20">
              <motion.button 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-12 py-6 btn-medical-secondary text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft className="w-6 h-6 inline mr-2" />
                Sebelumnya
              </motion.button>
              <motion.button 
                type={currentStep === 6 ? "submit" : "button"}
                onClick={currentStep === 6 ? undefined : nextStep}
                disabled={loading}
                className="px-12 py-6 btn-primary text-xl font-bold shadow-3xl disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white/30 border-t-emerald-400 rounded-full animate-spin inline mr-3" />
                    Memproses...
                  </>
                ) : currentStep === 6 ? (
                  'Prediksi AI'
                ) : (
                  <>
                    Selanjutnya 
                    <ChevronRight className="w-6 h-6 inline ml-2" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {result && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-12 mt-16 text-center"
          >
            <HeartPulse className="w-32 h-32 mx-auto mb-8 text-emerald-400 animate-pulse shadow-emerald-glow" />
            <h2 className="text-5xl font-black text-emerald-400 mb-8">Risiko {result.risk}</h2>
            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
              <div className="p-8 rounded-3xl bg-emerald-500/20 border-emerald-400/50">
                <span className="text-5xl font-black text-emerald-300">{Math.round(result.probability.low * 100)}%</span>
                <p className="font-mono uppercase text-emerald-200">Rendah</p>
              </div>
              <div className="p-8 rounded-3xl bg-red-500/20 border-red-400/50">
                <span className="text-5xl font-black text-red-300">{Math.round(result.probability.high * 100)}%</span>
                <p className="font-mono uppercase text-red-200">Tinggi</p>
              </div>
            </div>
            <p className="text-xl mt-8 px-8 py-6 bg-black/40 backdrop-blur border border-white/30 rounded-3xl font-semibold">{result.advice}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PredictWizard;

