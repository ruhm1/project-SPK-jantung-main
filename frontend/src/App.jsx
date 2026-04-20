import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { HeartPulse, HeartPulseIcon, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Predict from './pages/Predict.jsx';

import DynamicBg from './components/DynamicBg.jsx';

function App() {
  return (
    <Router>
      <DynamicBg />
      <div className="min-h-screen relative z-10">
        {/* Navbar */}
        <nav className="bg-slate-900/80 backdrop-blur-md shadow-2xl fixed w-full z-50 border-b border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-20">
              <div className="flex items-center space-x-3">
                <HeartPulse className="w-10 h-10 text-cyan-400 animate-pulse drop-shadow-lg" />
                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">SPK Jantung</h1>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <NavLink to="/" className="flex items-center space-x-2 px-4 py-3 rounded-xl text-lg font-bold text-white hover:text-cyan-300 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm">
                  <HeartPulseIcon className="w-6 h-6" />
                  <span>Dashboard</span>
                </NavLink>
                <NavLink to="/predict" className="flex items-center space-x-2 px-4 py-3 rounded-xl text-lg font-bold text-white hover:text-emerald-300 hover:bg-slate-800/50 transition-all duration-300 backdrop-blur-sm">
                  <Activity className="w-6 h-6" />
                  <span>Prediksi</span>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>

        <main className="pt-24 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/predict" element={<Predict />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

