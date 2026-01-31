import React, { useState, useEffect } from 'react';
import { 
  CreditCard, LayoutDashboard, LogOut, CheckCircle2, Zap, 
  ShieldCheck, Brain, Rocket, ChevronRight, Menu, X, Star, 
  History, Plus, Loader2, Copy, BarChart3, Clock, AlertTriangle, 
  Wallet, Ticket, Trophy, Sparkles, QrCode, RefreshCw, Lock, Mail, User, School, LogIn, UserPlus, ArrowLeft, ArrowRight
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, getAuth } from 'firebase/auth';
import { 
  doc, onSnapshot, setDoc, query, collection, 
  where, orderBy, runTransaction, getDoc 
} from 'firebase/firestore';

// --- CONFIG ---
import { auth, db } from './firebase'; 

const UTBKStudentApp = ({ prefilledToken, onExamComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl p-8 max-w-2xl text-center shadow-2xl">
        <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto mb-6 flex items-center justify-center">
          <AlertTriangle size={40} className="text-yellow-900"/>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Exam Module Coming Soon
        </h1>
        <p className="text-gray-600 mb-6">
          File <code className="bg-gray-100 px-2 py-1 rounded">UTBKStudentApp.jsx</code> belum tersedia.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-indigo-900 font-semibold mb-2">Token Anda:</p>
          <p className="font-mono text-2xl text-indigo-600 font-black">{prefilledToken}</p>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Untuk sementara, Anda bisa menggunakan token ini di halaman ujian terpisah.
        </p>
        <button 
          onClick={onExamComplete}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

// ==========================================
// (AuthenticationScreen, PackageSelection, PaymentModal, StudentDashboard, App)
// ==========================================

const EXAM_APP_URL = "https://ujian.liezira.com"; 

// ==========================================
// 1. KOMPONEN: AUTHENTICATION SCREEN (RE-DESIGNED)
// ==========================================
const AuthenticationScreen = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '', school: '' });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        onAuthSuccess(cred.user);
      } else {
        if (!formData.displayName || !formData.school) throw new Error("Nama dan Sekolah wajib diisi");
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.displayName });
        await setDoc(doc(db, 'users', cred.user.uid), {
          email: formData.email,
          displayName: formData.displayName,
          school: formData.school,
          credits: 0,
          createdAt: new Date().toISOString()
        });
        onAuthSuccess(cred.user);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] relative flex items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* --- BACKGROUND AMBIENT GLOW --- */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>
      
      {/* --- MAIN CARD --- */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl z-10">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center justify-center mb-8 relative">
          {/* Logo Glow Behind */}
          <div className="absolute inset-0 bg-indigo-500 blur-[50px] opacity-20 rounded-full w-24 h-24 mx-auto top-4"></div>
          
          {/* Floating Syntax Elements (Visual Decoration) */}
          <div className="absolute -left-2 top-0 animate-bounce delay-700 opacity-60">
            <Sparkles className="text-yellow-400 w-6 h-6" />
          </div>
          <div className="absolute -right-2 top-8 animate-bounce delay-1000 opacity-60">
            <Brain className="text-pink-400 w-6 h-6" />
          </div>

          <img 
            src="/LogoRuangSimulasi.svg" 
            alt="Logo Ruang Simulasi" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-2xl" 
          />
          
          <div className="text-center mt-4">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {mode === 'login' ? 'Selamat Datang' : 'Mulai Sekarang'}
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 font-medium">
              Platform Simulasi UTBK #1
            </p>
          </div>
        </div>
        
        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-indigo-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Nama Lengkap" 
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  required 
                  value={formData.displayName} 
                  onChange={e=>setFormData({...formData, displayName:e.target.value})} 
                />
              </div>
              <div className="relative">
                <School className="absolute left-4 top-3.5 text-indigo-300 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Asal Sekolah" 
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  required 
                  value={formData.school} 
                  onChange={e=>setFormData({...formData, school:e.target.value})} 
                />
              </div>
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-indigo-300 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Email Kamu" 
              className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              required 
              value={formData.email} 
              onChange={e=>setFormData({...formData, email:e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-indigo-300 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              required 
              value={formData.password} 
              onChange={e=>setFormData({...formData, password:e.target.value})} 
            />
          </div>
          
          <button 
            disabled={loading} 
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin"/> : (
              <>
                {mode === 'login' ? 'Masuk Dashboard' : 'Daftar Akun'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm mb-2">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}
          </p>
          <button 
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')} 
            className="text-white font-semibold hover:text-indigo-300 transition-colors border-b border-transparent hover:border-indigo-300"
          >
            {mode === 'login' ? 'Buat Akun Baru' : 'Login Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. KOMPONEN: PACKAGE SELECTION (Midtrans - Fixed Prices)
// ==========================================
const PackageSelection = ({ user, onClose, onPaymentInitiated }) => {
  const [loading, setLoading] = useState(false);
  
  // FIX: HARGA DISESUAIKAN DENGAN LANDING PAGE
  const packages = [
    { 
      id: 'pkg_hemat', 
      name: 'Paket Hemat', 
      credits: 1, 
      price: 10000, 
      color: 'from-blue-500 to-cyan-500' 
    },
    { 
      id: 'pkg_pejuang', 
      name: 'Paket Pejuang', 
      credits: 3, 
      price: 25000, // Diubah dari 20.000 ke 25.000
      color: 'from-purple-500 to-pink-500', 
      best: true 
    },
    { 
      id: 'pkg_pro', 
      name: 'Paket Sultan', 
      credits: 10, 
      price: 75000, // Diubah dari 50.000 ke 75.000
      color: 'from-orange-500 to-red-500' 
    }
  ];

  const handleBuy = async (pkg) => {
    setLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('https://admin.ruangsimulasi.com/api/createPayment', { // Pastikan URL API benar
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
        body: JSON.stringify({ packageId: pkg.id })
      });
      const data = await res.json();
      if (data.success) {
        onPaymentInitiated(data);
      } else {
        alert("Gagal memproses: " + (data.error || "Unknown error"));
      }
    } catch (e) {
      alert("Error network: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Top Up Credits</h2>
            <p className="text-gray-500 text-sm">Pilih paket simulasi sesuai kebutuhanmu</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"><X size={20}/></button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className={`border-2 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 relative overflow-hidden bg-white ${pkg.best ? 'border-purple-400 ring-4 ring-purple-50' : 'border-gray-100'}`}>
              
              {pkg.best && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                  PALING POPULER
                </div>
              )}

              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center text-white mb-5 shadow-lg`}>
                <Zap fill="currentColor" size={24}/>
              </div>
              
              <h3 className="font-bold text-xl text-gray-900 mb-1">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-black text-gray-900">{pkg.credits}</span>
                <span className="text-sm font-medium text-gray-500">Token Ujian</span>
              </div>
              
              <div className="py-4 border-t border-gray-100 mb-4">
                <p className="text-gray-400 text-xs mb-1">Harga Paket</p>
                <p className="text-2xl font-black text-indigo-600">Rp {pkg.price.toLocaleString('id-ID')}</p>
              </div>

              <button onClick={() => handleBuy(pkg)} disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r ${pkg.color} hover:opacity-90 transition shadow-lg`}>
                {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Beli Sekarang'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. KOMPONEN: PAYMENT MODAL (QRIS)
// ==========================================
const PaymentModal = ({ paymentData, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 text-center shadow-2xl">
        <h3 className="font-bold text-xl mb-4">Scan QRIS untuk Membayar</h3>
        <div className="border-4 border-indigo-100 rounded-2xl p-4 inline-block mb-4">
          <img src={paymentData.qrisUrl} alt="QRIS Code" className="w-64 h-64 object-contain" />
        </div>
        <p className="text-2xl font-black text-indigo-600 mb-2">Rp {paymentData.amount.toLocaleString('id-ID')}</p>
        <p className="text-gray-500 text-sm mb-6">Credit akan masuk otomatis setelah pembayaran berhasil.</p>
        <button onClick={onClose} className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200">Tutup</button>
      </div>
    </div>
  );
};

// ==========================================
// 4. KOMPONEN: STUDENT DASHBOARD
// ==========================================
const StudentDashboard = ({ user, onLogout, onStartExam, onBuyCredits }) => {
  const [credits, setCredits] = useState(0);
  const [tokens, setTokens] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setCredits(snap.data().credits || 0);
    });
    const qToken = query(collection(db, 'tokens'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
    const unsubToken = onSnapshot(qToken, (snap) => {
      setTokens(snap.docs.map(d => ({id: d.id, ...d.data()})));
    });
    return () => { unsubUser(); unsubToken(); };
  }, [user]);

  const handleGenerate = async () => {
    if (credits < 1) return onBuyCredits();
    if (!confirm("Gunakan 1 Credit?")) return;
    
    setIsGenerating(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/generateToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }
      });
      const data = await res.json();
      if (data.success) {
        alert("Token Berhasil: " + data.tokenCode);
      } else {
        throw new Error(data.error);
      }
    } catch (e) {
      alert("Gagal: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToken = (code) => { navigator.clipboard.writeText(code); alert("Disalin!"); };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 text-white p-8 pb-16 rounded-b-[2.5rem] shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Halo, {user.displayName?.split(' ')[0]} 👋</h1>
            <p className="text-indigo-200 text-sm">Siap untuk tryout hari ini?</p>
          </div>
          <button onClick={onLogout} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition"><LogOut size={20}/></button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl flex justify-between items-center border border-gray-100">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sisa Credit</p>
            <p className="text-4xl font-black text-gray-800">{credits}</p>
          </div>
          <button onClick={onBuyCredits} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2">
            <Plus size={18}/> Top Up
          </button>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-center">
          <h3 className="font-bold text-indigo-900 mb-2">Mulai Simulasi Baru</h3>
          <p className="text-indigo-600/70 text-sm mb-4">Gunakan 1 credit untuk mendapatkan token ujian.</p>
          <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2">
            {isGenerating ? <Loader2 className="animate-spin"/> : <Ticket size={20}/>}
            {isGenerating ? 'Memproses...' : 'Generate Token'}
          </button>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><History size={20}/> Riwayat Token</h3>
          <div className="space-y-3">
            {tokens.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                <div>
                  <div className="font-mono font-bold text-lg text-indigo-600">{t.tokenCode}</div>
                  <div className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</div>
                </div>
                {t.status === 'active' ? (
                  <div className="flex gap-2">
                    <button onClick={()=>copyToken(t.tokenCode)} className="p-2 border rounded-lg hover:bg-gray-50"><Copy size={16}/></button>
                    <button onClick={()=>onStartExam(t.tokenCode)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700">Mulai</button>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold">Selesai: {t.score}</span>
                )}
              </div>
            ))}
            {tokens.length === 0 && <div className="text-center py-8 text-gray-400">Belum ada riwayat.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. MAIN APP ORCHESTRATOR
// ==========================================
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('auth');
  const [examToken, setExamToken] = useState(null);
  
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) setView('dashboard');
      else setView('auth');
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setExamToken(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600 h-10 w-10"/></div>;

  return (
    <>
      {view === 'auth' && (
        <AuthenticationScreen onAuthSuccess={() => setView('dashboard')} />
      )}

      {view === 'dashboard' && user && (
        <StudentDashboard 
          user={user} 
          onLogout={handleLogout} 
          onStartExam={(token) => { setExamToken(token); setView('exam'); }} 
          onBuyCredits={() => setShowPackageModal(true)}
        />
      )}

      {view === 'exam' && examToken && (
        <UTBKStudentApp 
          prefilledToken={examToken} 
          onExamComplete={() => { setView('dashboard'); setExamToken(null); }} 
        />
      )}

      {showPackageModal && (
        <PackageSelection 
          user={user} 
          onClose={() => setShowPackageModal(false)}
          onPaymentInitiated={(data) => { setShowPackageModal(false); setPaymentData(data); }}
        />
      )}

      {paymentData && (
        <PaymentModal 
          paymentData={paymentData} 
          onClose={() => setPaymentData(null)} 
        />
      )}
    </>
  );
};

export default App;