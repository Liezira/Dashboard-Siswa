import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { onAuthStateChanged, signOut, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, runTransaction } from 'firebase/firestore';
import { auth, db } from './firebase'; 

// --- COMPONENTS ---
import SignUpPages from './SignUpPages'; 
import PackageSelection from './PackageSelection'; 

// --- ICONS ---
import { 
  Brain, Zap, Trophy, BarChart3, Shield, Clock, 
  ChevronRight, CheckCircle, Star, MessageCircle, 
  ArrowRight, Menu, X, Phone, Mail, Users, Award, Target,
  LogOut, Plus, History, Loader2, Ticket, Copy, Instagram, Facebook, Twitter,
  ExternalLink, RefreshCw, CheckCircle2, XCircle, AlertTriangle
} from 'lucide-react';

// ==========================================
// 1. HALAMAN VERIFIKASI (CUSTOM HANDLER)
// ==========================================
const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); 

  useEffect(() => {
    const verify = async () => {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) { setStatus('error'); return; }

      try {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        window.history.replaceState(null, '', '/verify-email'); 
        setTimeout(() => navigate('/dashboard'), 3000);
      } catch (error) {
        console.error(error);
        setStatus('error');
      }
    };
    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-xl text-center border border-gray-100">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-gray-800">Memverifikasi...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-gray-800">Berhasil!</h2>
            <p className="text-gray-500 text-sm mt-2">Email terverifikasi. Mengalihkan...</p>
            <button onClick={() => navigate('/dashboard')} className="mt-6 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold">Masuk Dashboard</button>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-gray-800">Link Tidak Valid</h2>
            <button onClick={() => navigate('/')} className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm">Kembali ke Home</button>
          </>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 2. VERIFICATION SCREEN (BLOCKER)
// ==========================================
const VerificationScreen = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleResend = async () => {
    setLoading(true);
    try {
      const actionCodeSettings = { url: window.location.origin + '/verify-email', handleCodeInApp: true };
      await sendEmailVerification(user, actionCodeSettings);
      setSent(true);
      alert("Email terkirim! CEK FOLDER SPAM/JUNK.");
    } catch (e) {
      alert("Tunggu sebentar sebelum kirim ulang.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => { await signOut(auth); navigate('/'); };
  const handleReload = () => { window.location.reload(); };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6"><Mail className="text-yellow-600 w-10 h-10" /></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Email</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">Halo <b>{user.displayName}</b>, cek emailmu ({user.email}) dan klik link verifikasi.</p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6 flex items-start gap-3 text-left">
          <AlertTriangle className="text-orange-500 w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-orange-700 leading-snug"><b>Tidak ada email?</b> Cek folder <b>SPAM</b> atau <b>JUNK</b>.</p>
        </div>
        <div className="space-y-3">
          <button onClick={handleReload} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"><RefreshCw size={18}/> Saya Sudah Klik Link</button>
          <button onClick={handleResend} disabled={loading || sent} className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition">{loading ? 'Mengirim...' : sent ? 'Email Terkirim (Cek Spam)' : 'Kirim Ulang Email'}</button>
          <button onClick={handleLogout} className="text-gray-400 text-sm hover:text-red-500 underline mt-4">Keluar / Ganti Akun</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. DASHBOARD COMPONENT (LAUNCHER MODE + SKOR)
// ==========================================
const Dashboard = ({ user }) => {
  if (!user.emailVerified) return <VerificationScreen user={user} />;

  const [userData, setUserData] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const EXAM_URL = "https://utbk-simulation-tester-student.vercel.app";

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (doc) => setUserData(doc.data()));
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const loadedTokens = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      loadedTokens.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTokens(loadedTokens);
    });
    return () => unsub();
  }, [user]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const handleGenerateToken = async () => {
    const credits = userData?.credits || 0;
    if (credits < 1) { alert("Credit tidak cukup!"); setShowPackageModal(true); return; }
    if (!confirm("Gunakan 1 Credit?")) return;
    setIsGenerating(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists() || (userDoc.data().credits || 0) < 1) throw "Credit tidak valid.";
        const tokenCode = `UTBK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const tokenRef = doc(db, 'tokens', tokenCode);
        transaction.update(userRef, { credits: (userDoc.data().credits || 0) - 1, generatedTokens: [...(userDoc.data().generatedTokens || []), tokenCode] });
        transaction.set(tokenRef, { tokenCode, userId: user.uid, studentName: userDoc.data().displayName, studentSchool: userDoc.data().school, studentPhone: userDoc.data().phone || user.email, status: 'active', score: null, createdAt: new Date().toISOString(), isSent: true, sentMethod: 'DASHBOARD_GENERATE' });
      });
      alert("Token berhasil dibuat!");
    } catch (error) { alert("Gagal: " + error); } finally { setIsGenerating(false); }
  };

  const handleOpenExamApp = (tokenCode) => {
    navigator.clipboard.writeText(tokenCode);
    window.open(`${EXAM_URL}?token=${tokenCode}`, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <div className="bg-indigo-600 text-white p-8 pb-16 rounded-b-[2.5rem] shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
             <img src="/LogoRuangSimulasi.svg" alt="Logo" className="w-28 h-28 object-contain drop-shadow-lg bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl ring-1 ring-white/50" />
             <div><h1 className="text-2xl font-bold">Halo, {userData?.displayName?.split(' ')[0] || 'Siswa'} 👋</h1><p className="text-indigo-200 text-sm mt-1">Siap untuk simulasi hari ini?</p></div>
          </div>
          <button onClick={handleLogout} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition text-white"><LogOut size={20}/></button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl flex justify-between items-center border border-gray-100">
          <div><p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sisa Credit</p><p className="text-4xl font-black text-gray-800">{userData?.credits || 0}</p></div>
          <button onClick={() => setShowPackageModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"><Plus size={18}/> Top Up</button>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-center">
          <h3 className="font-bold text-indigo-900 mb-2 text-lg">Mulai Simulasi Baru</h3>
          <p className="text-indigo-600/70 text-sm mb-6">Gunakan 1 credit untuk token ujian.</p>
          <button onClick={handleGenerateToken} disabled={isGenerating} className="w-full bg-white text-indigo-600 py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 border border-indigo-100">{isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Ticket size={20}/>} {isGenerating ? 'Memproses...' : 'Generate Token (-1 Credit)'}</button>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 px-2"><History size={20} className="text-gray-400"/> Riwayat Token</h3>
          <div className="space-y-3">
            {tokens.length === 0 && <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">Belum ada riwayat ujian.</div>}
            {tokens.map(t => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-md">
                <div className="text-center md:text-left">
                  <div className="font-mono font-bold text-lg text-indigo-600 tracking-wider">{t.tokenCode}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(t.createdAt).toLocaleString('id-ID')}</div>
                  {t.score !== null && t.score !== undefined && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold"><Trophy size={12}/> Skor: {t.score}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button onClick={() => {navigator.clipboard.writeText(t.tokenCode); alert("Token disalin!")}} className="p-2 border rounded-lg hover:bg-gray-50 text-gray-500" title="Salin Token"><Copy size={18}/></button>
                  {t.score !== null && t.score !== undefined ? (
                    <button onClick={() => handleOpenExamApp(t.tokenCode)} className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-indigo-100 text-indigo-600 rounded-lg font-bold text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-2">Lihat Hasil <ExternalLink size={14}/></button>
                  ) : (
                    <button onClick={() => handleOpenExamApp(t.tokenCode)} className="flex-1 md:flex-none px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold text-sm shadow hover:shadow-lg hover:-translate-y-0.5 transition flex items-center justify-center gap-2">Mulai Ujian <ExternalLink size={14}/></button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showPackageModal && <PackageSelection user={user} onClose={() => setShowPackageModal(false)} />}
    </div>
  );
};

// ==========================================
// 4. LANDING PAGE COMPONENT (LENGKAP!)
// ==========================================
const LandingPageContent = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();
  const handleAuth = () => navigate('/signup'); 

  const features = [
    { icon: <Brain className="w-8 h-8" />, title: "Soal Berkualitas Tinggi", description: "Ribuan soal berkualitas yang disusun oleh tim expert sesuai kisi-kisi UTBK terbaru.", color: "from-blue-500 to-cyan-500" },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Analisis Performa", description: "Setiap simulasi langsung dipecah: subtest lemah, waktu terbuang, dan potensi naik skor.", color: "from-purple-500 to-pink-500" },
    { icon: <Trophy className="w-8 h-8" />, title: "Leaderboard Real-time", description: "Bandingkan skormu dengan ribuan peserta lain dan lacak perkembanganmu.", color: "from-orange-500 to-red-500" },
    { icon: <Shield className="w-8 h-8" />, title: "Sistem Aman & Terpercaya", description: "Fullscreen mode dengan deteksi kecurangan untuk simulasi ujian yang realistis.", color: "from-green-500 to-emerald-500" },
    { icon: <Clock className="w-8 h-8" />, title: "Timer Akurat", description: "Sistem timer yang presisi untuk melatih manajemen waktu seperti ujian sesungguhnya.", color: "from-indigo-500 to-blue-500" },
    { icon: <Zap className="w-8 h-8" />, title: "Akses Fleksibel", description: "Kerjakan kapan saja, dimana saja. Token valid 24 jam setelah diaktifkan.", color: "from-yellow-500 to-orange-500" }
  ];

  const packages = [
    { name: 'Paket Hemat', subtitle: 'Coba dulu sebelum serius', credits: 1, price: "10.000", originalPrice: null, description: '1 Token untuk 1x simulasi UTBK', features: ['1 Token Ujian Simulasi', 'Analisis Nilai Dasar', 'Akses Leaderboard'], color: "from-blue-500 to-cyan-500", popular: false },
    { name: 'Paket Pejuang', subtitle: 'Paling seimbang & paling dipilih', credits: 3, price: "25.000", originalPrice: "30.000", description: '3 Token untuk latihan intensif', features: ['3 Token Ujian Simulasi', 'Analisis Nilai & Ranking Akurat', 'Leaderboard Nasional'], color: "from-purple-500 to-pink-500", popular: true },
    { name: 'Paket Sultan', subtitle: 'Paling hemat untuk pejuang serius', credits: 10, price: "75.000", originalPrice: "100.000", description: '10 Token untuk persiapan maksimal', features: ['10 Token Ujian Simulasi', 'Analisis Lengkap & Riwayat', 'Leaderboard Nasional'], color: "from-orange-500 to-red-500", popular: false }
  ];

  const testimonials = [
    { name: "Fayla Zanatun Zahir", school: "SMA Negeri 9 Kota Tangerang Selatan", text: "Bagus banget!, tampilan dan suasananya mirip kaya UTBK beneran jadi bisa lebih siap mental buat UTBK nanti.", rating: 5, avatar: "🎓" },
    { name: "Ravin Syach", school: "SMK Negeri 19 JAKARTA (Gapyear)", text: "Overall bagus sih antarmukanya udah berasa ngerjain real UTBK. Jujur soal soalnya BERAT BANGET, ini cocok banget buat simulasi.", rating: 5, avatar: "📚" },
    { name: "Damar Fathan Nugraha", school: "SMA Negeri 9 Kota Tangerang", text: "Timer dan fullscreen mode bikin latihan jadi realistis. Pas ujian beneran nanti udah gak grogi lagi!", rating: 5, avatar: "🏆" }
  ];

  const faqs = [
    { question: "Bagaimana cara menggunakan platform ini?", answer: "Sangat mudah! Cukup daftar akun, beli credits sesuai kebutuhan, generate token, dan mulai ujian." },
    { question: "Apakah soal-soalnya mirip dengan UTBK asli?", answer: "Ya! Soal-soal kami disusun oleh tim expert yang mengacu pada kisi-kisi UTBK terbaru." },
    { question: "Berapa lama token berlaku?", answer: "Setiap token berlaku selama 24 jam sejak pertama kali diaktifkan." },
    { question: "Apakah credits bisa hangus?", answer: "Credits akan hangus jika tidak digunakan dalam 3 bulan sejak pembelian." },
    { question: "Bagaimana sistem pembayarannya?", answer: "Kami menggunakan payment gateway Midtrans yang aman dan terpercaya." },
    { question: "Apakah ada garansi uang kembali?", answer: "Maaf, credits yang sudah dibeli tidak bisa di-refund. Namun kami menjamin kualitas soal kami." },
    { question: "Apakah semua paket punya fitur yang sama?", answer: "Ya. Semua paket mendapatkan fitur dan kualitas yang sama. Perbedaannya hanya jumlah token." }
  ];

  const stats = [
    { number: "10,000+", label: "Siswa Terdaftar", icon: <Users /> },
    { number: "50,000+", label: "Ujian Diselesaikan", icon: <Award /> },
    { number: "4.9/5", label: "Rating Pengguna", icon: <Star /> },
    { number: "95%", label: "Tingkat Kepuasan", icon: <Target /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center gap-3"><img src="/LogoRuangSimulasi.svg" alt="Logo" className="w-20 h-20 md:w-28 md:h-28" /></div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 font-medium">Fitur</a>
              <a href="#pricing" className="text-gray-600 hover:text-indigo-600 font-medium">Harga</a>
              <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 font-medium">Testimoni</a>
              <a href="#faq" className="text-gray-600 hover:text-indigo-600 font-medium">FAQ</a>
              <button onClick={handleAuth} className="text-indigo-600 font-semibold">Login</button>
              <button onClick={handleAuth} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg">Mulai Gratis</button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
          {mobileMenuOpen && <div className="md:hidden py-4 space-y-3 border-t border-gray-100 bg-white absolute left-0 right-0 px-4 shadow-xl z-50"><a href="#features" className="block py-2">Fitur</a><a href="#pricing" className="block py-2">Harga</a><button onClick={handleAuth} className="block w-full text-left py-2 font-bold text-indigo-600">Login</button></div>}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-16 md:py-32">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-7xl font-black text-gray-900 mb-6">Raih Skor <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Impian</span></h1>
          <button onClick={handleAuth} className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-2xl flex items-center justify-center gap-2 mx-auto">Daftar Sekarang <ArrowRight/></button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">{stats.map((stat, i) => (<div key={i} className="bg-white/60 p-4 rounded-2xl shadow-lg border border-indigo-100"><div className="text-indigo-600 flex justify-center mb-2">{stat.icon}</div><div className="text-2xl font-black">{stat.number}</div></div>))}</div>
        </div>
      </section>
      
      {/* Features */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black">Kenapa Kami?</h2></div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f,i)=><div key={i} className="p-6 border rounded-2xl hover:shadow-xl transition"><div className="mb-4 text-indigo-600">{f.icon}</div><h3 className="font-bold text-xl mb-2">{f.title}</h3><p className="text-gray-600">{f.description}</p></div>)}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black">Paket Hemat</h2></div>
          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((p,i)=><div key={i} className={`relative bg-white rounded-3xl p-8 border-2 ${p.popular ? 'border-purple-300 shadow-xl scale-105 z-10' : 'border-gray-200 shadow-lg'}`}>{p.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">POPULER</div>}<h3 className="text-2xl font-black">{p.name}</h3><div className="text-3xl font-black my-4">Rp {p.price}</div><ul className="space-y-2 mb-6">{p.features.map((f,j)=><li key={j} className="flex gap-2"><CheckCircle className="w-5 text-green-500"/>{f}</li>)}</ul><button onClick={handleAuth} className={`w-full py-3 rounded-xl text-white font-bold bg-gradient-to-r ${p.color}`}>Pilih Paket</button></div>)}
          </div>
        </div>
      </section>

      {/* Testimonials (INI YANG HILANG KEMARIN) */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black">Apa Kata Mereka?</h2></div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t,i)=><div key={i} className="p-6 border rounded-2xl bg-gray-50"><div className="flex gap-1 text-yellow-400 mb-2">{[...Array(t.rating)].map((_,k)=><Star key={k} size={16} fill="currentColor"/>)}</div><p className="italic text-gray-700 mb-4">"{t.text}"</p><div className="font-bold">{t.name}</div><div className="text-xs text-gray-500">{t.school}</div></div>)}
          </div>
        </div>
      </section>

      {/* FAQ (INI JUGA HILANG KEMARIN) */}
      <section id="faq" className="py-16 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-black">FAQ</h2></div>
          <div className="space-y-4">
            {faqs.map((q,i)=><div key={i} className="bg-white p-6 rounded-xl shadow-sm cursor-pointer" onClick={()=>setActiveFaq(activeFaq===i?null:i)}><div className="flex justify-between items-center font-bold"><span>{q.question}</span><ChevronRight className={`transition ${activeFaq===i?'rotate-90':''}`}/></div>{activeFaq===i && <p className="mt-2 text-gray-600">{q.answer}</p>}</div>)}
          </div>
        </div>
      </section>

      {/* Footer (INI JUGA DIKEMBALIKAN) */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <img src="/LogoRuangSimulasi.svg" className="w-24 mb-4" alt="Logo"/>
            <p className="text-sm">Platform simulasi UTBK terpercaya.</p>
          </div>
          <div><h4 className="font-bold text-white mb-4">Link</h4><ul className="space-y-2 text-sm"><li><a href="#features">Fitur</a></li><li><a href="#pricing">Harga</a></li></ul></div>
          <div><h4 className="font-bold text-white mb-4">Kontak</h4><ul className="space-y-2 text-sm"><li>WhatsApp Support</li><li>lieziragroup@gmail.com</li></ul></div>
        </div>
        <div className="text-center text-xs text-gray-600 mt-12 pt-8 border-t border-gray-800">© 2026 RuangSimulasi. All rights reserved.</div>
      </footer>
    </div>
  );
};

// ==========================================
// 5. MAIN APP ROUTER
// ==========================================
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auto Logout 30 Menit
  const handleUserActivity = useCallback(() => {
    clearTimeout(window.inactivityTimer);
    if (auth.currentUser) {
      window.inactivityTimer = setTimeout(() => {
        alert("Sesi berakhir (30 menit inaktif).");
        signOut(auth);
      }, 30 * 60 * 1000);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); handleUserActivity(); });
    return () => { unsub(); window.removeEventListener('mousemove', handleUserActivity); clearTimeout(window.inactivityTimer); };
  }, [handleUserActivity]);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <LandingPageContent /> : <Navigate to="/dashboard" />} />
        <Route path="/signup" element={!user ? <SignUpPages /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/signup" />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
