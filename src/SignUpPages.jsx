import React, { useState } from 'react';
import { 
  User, School, Mail, Lock, Loader2, ArrowRight, Sparkles, Brain 
} from 'lucide-react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; 
import { auth, db } from './firebase'; 

const SignUpPages = () => {
  const [mode, setMode] = useState('login'); 
  const [loading, setLoading] = useState(false);
  
  // State untuk form input
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    displayName: '', 
    school: '' 
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'login') {
        // ==========================================
        // 1. LOGIKA LOGIN (Dengan Perbaikan Data Otomatis)
        // ==========================================
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // CEK DATABASE: Apakah data siswa ini sudah ada di Firestore (Admin Panel)?
        const userDocRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userDocRef);

        // JIKA TIDAK ADA (Kasus akun hantu), KITA BUATKAN SEKARANG
        if (!userSnap.exists()) {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Siswa Tanpa Nama',
            school: '-',
            role: 'student',      // Wajib ada
            credits: 0,           // Wajib ada untuk TopUp
            createdAt: new Date().toISOString(),
            generatedTokens: []
          });
          console.log("Data user diperbaiki otomatis.");
        }

      } else {
        // ==========================================
        // 2. LOGIKA REGISTER (Daftar Baru)
        // ==========================================
        if (!formData.displayName || !formData.school) {
          throw new Error("Nama dan Sekolah wajib diisi");
        }

        // A. Buat Akun Auth
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // B. Update Nama Profil
        await updateProfile(user, { displayName: formData.displayName });

        // C. SIMPAN KE DATABASE FIRESTORE (Agar muncul di Admin Panel)
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: formData.email,
          displayName: formData.displayName,
          school: formData.school,
          role: 'student',
          credits: 0,
          createdAt: new Date().toISOString(),
          generatedTokens: []
        });
      }
      
      // Berhasil! App.jsx akan mendeteksi login dan pindah ke Dashboard otomatis.

    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (err.code === 'auth/invalid-credential') msg = "Email atau password salah.";
      if (err.code === 'auth/email-already-in-use') msg = "Email sudah terdaftar.";
      if (err.code === 'auth/weak-password') msg = "Password minimal 6 karakter.";
      alert(msg);
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
          
          {/* Floating Icons */}
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
          
          {/* Input Tambahan untuk Register */}
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
          
          {/* Input Email & Password */}
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
          
          {/* Tombol Action */}
          <button 
            disabled={loading} 
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin"/> : (
              <>
                {mode === 'login' ? 'Masuk Dashboard' : 'Daftar Akun'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
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

export default SignUpPages;