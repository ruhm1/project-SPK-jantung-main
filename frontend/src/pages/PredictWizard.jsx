import { useForm, useWatch } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, AlertCircle, Zap, User, Activity, Droplets, Brain, Stethoscope, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ResultAnimation from '../components/ResultAnimation.jsx';

const STEPS = [
  { 
    id: 0, 
    title: 'Usia', 
    field: 'age', 
    icon: User, 
    min: { value: 20, message: 'Minimal 20 tahun' }, 
    max: { value: 100, message: 'Maksimal 100 tahun' },
    unit: 'tahun',
    description: 'Masukkan usia Anda (20-100 tahun)',
    placeholder: '52',
    type: 'number'
  },
  { 
    id: 1, 
    title: 'Jenis Kelamin', 
    field: 'sex', 
    icon: Activity,
    description: 'Pilih jenis kelamin',
    options: [
      { value: '1', label: 'Laki-laki', icon: Activity, desc: 'Nilai: 1' },
      { value: '0', label: 'Perempuan', icon: User, desc: 'Nilai: 0' }
    ],
    type: 'radio'
  },
  { 
    id: 2, 
    title: 'Tekanan Darah', 
    field: 'trestbps', 
    icon: Droplets, 
    min: { value: 90, message: 'Minimal 90 mmHg' },
    max: { value: 250, message: 'Maksimal 250 mmHg' },
    unit: 'mmHg',
    description: 'Tekanan darah istirahat (mmHg)',
    placeholder: '120',
    type: 'number'
  },
  { 
    id: 3, 
    title: 'Kolesterol', 
    field: 'chol', 
    icon: HeartPulse, 
    min: { value: 100, message: 'Minimal 100 mg/dl' },
    max: { value: 600, message: 'Maksimal 600 mg/dl' },
    unit: 'mg/dl',
    description: 'Kadar kolesterol serum (mg/dl)',
    placeholder: '250',
    type: 'number'
  },
  { 
    id: 4, 
    title: 'Gula Darah', 
    field: 'fbs', 
    icon: Brain,
    description: 'Gula darah puasa > 120 mg/dl?',
    options: [
      { value: '0', label: 'Normal (≤ 120)', icon: Brain },
      { value: '1', label: 'Tinggi (> 120)', icon: AlertCircle }
    ],
    type: 'radio'
  },
  { 
    id: 5, 
    title: 'Hasil EKG', 
    field: 'restecg', 
    icon: Stethoscope,
    description: 'Elektrokardiogram istirahat:\n• Normal: Hasil EKG normal\n• ST-T Abnormal: Gangguan gelombang ST-T\n• Hipertrofi: Pembesaran ventrikel kiri',
    options: [
      { value: '0', label: 'Normal', icon: HeartPulse, desc: 'EKG normal' },
      { value: '1', label: 'ST-T Abnormal', icon: Activity, desc: 'Gangguan ST-T' },
      { value: '2', label: 'Hipertrofi', icon: AlertCircle, desc: 'Ventrikel membesar' }
    ],
    type: 'radio'
  },
  { 
    id: 6, 
    title: 'Detak Jantung', 
    field: 'thalach', 
    icon: HeartPulse, 
    min: { value: 70, message: 'Minimal 70 bpm' },
    max: { value: 220, message: 'Maksimal 220 bpm' },
    unit: 'bpm',
    description: 'Maksimum denyut jantung (bpm)',
    placeholder: '150',
    type: 'number'
  }
];

function PredictWizard() {
  const formMethods = useForm({
    defaultValues: {
      age: '',
      sex: '',
      trestbps: '',
      chol: '',
      fbs: '',
      restecg: '',
      thalach: ''
    },
    mode: 'onChange'
  });
  
  const { register, handleSubmit, formState, control, watch, trigger, reset } = formMethods;
  const { errors } = formState;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const watchedAge = useWatch({ control, name: 'age' });
  const watchedSex = useWatch({ control, name: 'sex' });
  const watchedField = useWatch({ control, name: STEPS[currentStep]?.field });

  const step = STEPS[currentStep];

  const getAgeCategory = (age) => {
    const numAge = parseInt(age);
    if (isNaN(numAge)) return 'unknown';
    if (numAge < 30) return 'teen';
    if (numAge < 60) return 'adult';
    return 'elderly';
  };

  // Improved validation check to handle NaN from empty valueAsNumber inputs
  const isStepValid = !errors[step.field] && 
                      watchedField !== '' && 
                      watchedField !== undefined && 
                      !Number.isNaN(watchedField);

  const nextStep = async () => {
    const isCurrentFieldValid = await trigger(step.field);
    if (!isCurrentFieldValid || !isStepValid) return;
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => currentStep > 0 && setCurrentStep(currentStep - 1);

  const onSubmit = async (data) => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/predict', data, { timeout: 10000 });
      setResult(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
      setError('Backend tidak jalan. Coba jalankan: cd backend && python -m uvicorn main:app --reload');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result) {
      setLoading(false);
    }
  }, [result]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500/30 to-teal-500/30 backdrop-blur-xl rounded-2xl border border-emerald-500/50 shadow-xl mb-8">
            <Zap className="w-8 h-8 text-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-mono text-lg uppercase tracking-wider font-bold">
              {result ? '✅ Hasil 3D' : `Step ${currentStep + 1} dari 7`}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-2xl">
            {result ? 'Prediksi AI' : step.title}
          </h1>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          className="glass-card mb-12 p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            {STEPS.map((s, index) => (
              <motion.div
                key={s.id}
                className={`flex flex-col items-center cursor-pointer p-3 rounded-xl transition-all ${index === currentStep ? 'bg-emerald-500/50 ring-4 ring-emerald-400/60 shadow-lg shadow-emerald-glow scale-105' : index < currentStep ? 'bg-emerald-400/40 text-emerald-300' : 'text-slate-500 hover:text-emerald-300 hover:bg-emerald-500/20 hover:scale-105'}`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: index === currentStep ? 1.3 : 1 }}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl border-2 mb-1 ${index === currentStep ? 'bg-emerald-500 border-emerald-400 shadow-emerald-glow' : index < currentStep ? 'bg-emerald-400 border-emerald-400/70' : 'bg-slate-800/70 border-slate-600/60 hover:border-emerald-400'}`}
                >
                  <s.icon className={`w-6 h-6 ${index === currentStep ? 'text-white' : index < currentStep ? 'text-emerald-200' : 'text-slate-400 hover:text-emerald-300'}`} />
                </motion.div>
                <span className="text-xs font-mono uppercase tracking-wide font-bold">{s.id + 1}</span>
              </motion.div>
            ))}
          </div>
          <div className="w-full h-2 bg-slate-900/70 rounded-xl border border-slate-700/50">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md rounded-xl"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Step Guide */}
        <motion.div 
          className="glass-card p-6 md:p-8 rounded-2xl border-emerald-500/30 shadow-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-500/40 rounded-xl flex items-center justify-center border-2 border-emerald-400/70 flex-shrink-0 mt-1">
              <Info className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-300 mb-3">{step.title}</h3>
              <p className="text-base md:text-lg font-semibold text-slate-200 leading-relaxed">{step.description}</p>
              {step.min && (
                <div className="mt-4 p-4 bg-slate-900/70 border border-slate-700/60 rounded-xl">
                  <span className="text-emerald-400 font-mono text-xs uppercase tracking-wide font-bold block mb-1">Rentang:</span>
                  <span className="text-xl md:text-2xl font-bold text-slate-100">{step.min.value} - {step.max.value} {step.unit}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {!result ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -30 }}
              transition={{ duration: 0.4 }}
              className="glass-card p-12 rounded-2xl shadow-3xl border-emerald-500/30"
            >
              {/* Icon */}
              <motion.div 
                className="text-center mb-14"
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 4, -4, 0]
                }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <motion.div 
                  className={`w-32 h-32 mx-auto rounded-2xl flex items-center justify-center shadow-2xl border-4 shadow-[0_0_40px_rgba(16,185,129,0.4)] ${
                    currentStep === 0 && getAgeCategory(watchedAge) === 'teen' ? 'bg-gradient-to-r from-blue-500/50 border-blue-400' :
                    currentStep === 0 && getAgeCategory(watchedAge) === 'adult' ? 'bg-gradient-to-r from-emerald-500/50 border-emerald-400' :
                    currentStep === 0 && getAgeCategory(watchedAge) === 'elderly' ? 'bg-gradient-to-r from-orange-500/50 border-orange-400' :
                    currentStep === 1 && watchedSex === '1' ? 'bg-gradient-to-r from-blue-500/50 border-blue-400' :
                    currentStep === 1 && watchedSex === '0' ? 'bg-gradient-to-r from-pink-500/50 border-pink-400' :
                    'bg-gradient-to-r from-emerald-500/40 to-teal-500/40 border-emerald-400'
                  }`}
                >
                  {currentStep === 0 ? (
                    <User className={`w-18 h-18 animate-bounce ${
                      getAgeCategory(watchedAge) === 'teen' ? 'text-blue-200' :
                      getAgeCategory(watchedAge) === 'adult' ? 'text-emerald-200' :
                      'text-orange-200'
                    }`} />
                  ) : currentStep === 1 ? (
                    watchedSex === '1' ? <Activity className="w-18 h-18 text-blue-200 animate-pulse" /> : 
                    watchedSex === '0' ? <User className="w-18 h-18 text-pink-200 animate-pulse" /> :
                    <step.icon className="w-18 h-18 text-emerald-200" />
                  ) : (
                    <step.icon className="w-18 h-18 text-emerald-200 animate-pulse" />
                  )}
                </motion.div>
              </motion.div>

              {/* Input */}
              {step.type === 'number' && (
                <div className="text-center mb-16">
                  <motion.input 
                    {...register(step.field, { 
                      required: `${step.title} wajib diisi`, 
                      min: step.min, 
                      max: step.max,
                      valueAsNumber: true
                    })} 
                    type="number" 
                    placeholder={step.placeholder}
                    className={`w-full max-w-lg mx-auto block px-12 py-12 text-2xl md:text-3xl font-mono font-bold text-white text-center rounded-2xl transition-all duration-500 shadow-3xl border-4 ${
                      errors[step.field] 
                        ? 'border-red-500/80 bg-red-500/20 ring-8 ring-red-500/40 shadow-red-glow-xl hover:shadow-red-glow-2xl' 
                        : 'border-emerald-400/70 bg-white/10 ring-8 ring-emerald-500/30 shadow-emerald-glow-xl hover:shadow-emerald-glow-2xl hover:border-emerald-500/90 hover:bg-white/20'
                    }`}
                  />
                  {errors[step.field] && (
                    <motion.div className="mt-8 p-8 bg-red-500/30 border-4 border-red-400/70 rounded-2xl shadow-2xl shadow-red-glow-xl flex items-center gap-4 max-w-2xl mx-auto">
                      <AlertCircle className="w-12 h-12 text-red-300" />
                      <span className="text-xl font-bold text-red-100">{errors[step.field].message}</span>
                    </motion.div>
                  )}
                </div>
              )}

              {step.type === 'radio' && (
                <div className={`grid ${step.options.length === 2 ? 'md:grid-cols-2' : 'lg:grid-cols-3 md:grid-cols-2'} gap-6 max-w-4xl mx-auto`}>
                  {step.options.map((option) => {
                    const isSelected = watch(step.field) === option.value;
                    return (
                      <motion.label 
                        key={option.value}
                        className={`group cursor-pointer p-8 rounded-2xl border-4 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-400 ${
                          isSelected 
                            ? 'border-emerald-500/90 scale-105 ring-4 ring-emerald-500/60 bg-emerald-500/30 shadow-emerald-glow-xl hover:shadow-emerald-glow-2xl hover:scale-[1.08]' 
                            : 'border-white/30 hover:border-emerald-500/70 hover:bg-emerald-500/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input 
                          type="radio" 
                          value={option.value} 
                          {...register(step.field, { required: `${step.title} wajib dipilih` })} 
                          className="sr-only peer"
                        />
                        <option.icon className={`w-16 h-16 mx-auto mb-4 text-emerald-400 group-hover:text-emerald-300 animate-pulse ${isSelected ? 'animate-bounce scale-110 shadow-emerald-glow-lg' : ''}`} />
                        <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-2 line-clamp-1 drop-shadow-lg">{option.label}</h3>
                        <p className="text-sm md:text-base text-slate-200 text-center font-mono line-clamp-2">{option.desc}</p>
                        <div className="mt-6 w-full h-2 bg-white/20 rounded-xl">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl shadow-md"
                            initial={{ width: 0 }}
                            animate={{ width: isSelected ? '100%' : '0%' }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                      </motion.label>
                    );
                  })}
                </div>
              )}

              {/* Navigation */}
              <motion.div className="flex gap-6 justify-center pt-16">
                <motion.button 
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="px-12 py-6 btn-medical-secondary text-base font-bold shadow-2xl disabled:opacity-50 hover:shadow-ecg-glow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ChevronLeft className="w-5 h-5 inline mr-2" />
                  Kembali
                </motion.button>
                <motion.button 
                  type="button"
                  onClick={currentStep === 6 ? handleSubmit(onSubmit) : nextStep}
                  disabled={!isStepValid || loading}
                  className={`px-16 py-6 text-base font-bold shadow-3xl rounded-2xl flex items-center gap-2 transition-all duration-500 uppercase tracking-wide ${
                    !isStepValid || loading 
                      ? 'bg-slate-800/50 cursor-not-allowed opacity-60' 
                      : 'btn-primary hover:shadow-emerald-glow-xl hover:scale-[1.05] bg-gradient-to-r from-emerald-600 to-teal-600'
                  }`}
                  whileHover={!isStepValid || loading ? {} : { scale: 1.06 }}
                  whileTap={!isStepValid || loading ? {} : { scale: 0.96 }}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
                  ) : currentStep === 6 ? (
                    <>
                      <HeartPulse className="w-5 h-5 animate-pulse" />
                      Hasil 3D
                    </>
                  ) : (
                    'Lanjut'
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 rounded-2xl shadow-3xl max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-5xl font-black text-emerald-400 mb-8 drop-shadow-2xl">{result.risk}</h2>
                <div className="w-full h-screen max-h-[70vh] rounded-2xl border-4 border-emerald-500/30 shadow-2xl mb-12 overflow-hidden relative">
                  <ResultAnimation result={result} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="p-8 rounded-2xl bg-emerald-500/30 border-4 border-emerald-400 shadow-emerald-glow">
                  <span className="text-4xl font-black text-emerald-200">{Math.round(result.probability.low * 100)}%</span>
                  <p className="font-mono uppercase text-emerald-100 mt-2">Risiko Rendah</p>
                </div>
                <div className="p-8 rounded-2xl bg-red-500/30 border-4 border-red-400 shadow-red-glow md:col-span-1">
                  <span className="text-4xl font-black text-red-200">{Math.round(result.probability.high * 100)}%</span>
                  <p className="font-mono uppercase text-red-100 mt-2">Risiko Tinggi</p>
                </div>
                <div className="p-8 rounded-2xl bg-teal-500/30 border-4 border-teal-400 shadow-teal-glow">
                  <span className="text-4xl font-black text-teal-200">{result.risk}</span>
                  <p className="font-mono uppercase text-teal-100 mt-2">Kesimpulan</p>
                </div>
              </div>
              <div className="p-8 bg-black/50 backdrop-blur border border-emerald-400/50 rounded-2xl mb-12">
                <p className="text-xl font-semibold text-white text-center">{result.advice}</p>
              </div>
              <motion.button
                onClick={() => {
                  setResult(null);
                  setCurrentStep(0);
                  reset();
                }}
                className="w-full btn-primary py-8 px-16 text-xl rounded-2xl"
                whileHover={{ scale: 1.05 }}
              >
                Prediksi Lagi
              </motion.button>
            </motion.div>
          </div>
        )}

        {error && (
          <motion.div 
            className="glass-card p-12 mt-16 text-center rounded-2xl shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-24 h-24 text-red-400 mx-auto mb-8 animate-pulse shadow-red-glow" />
            <p className="text-2xl font-bold text-red-300 mb-8">{error}</p>
            <motion.button 
              onClick={() => setError(null)}
              className="btn-medical-secondary px-16 py-8 text-lg"
              whileHover={{ scale: 1.05 }}
            >
              Coba Lagi
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default PredictWizard;