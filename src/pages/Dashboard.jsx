import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where, runTransaction } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { LogOut, Plus, History, Loader2, Ticket, Copy, Trophy, ExternalLink } from 'lucide-react';
import VerificationScreen from './VerificationScreen';
import PackageSelection from '../PackageSelection';
import { EXAM_URL } from '../constants/config';

const Dashboard = ({ user }) => {
  if (!user.emailVerified) return <VerificationScreen user={user}/>;

  const [userData, setUserData] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (d) => setUserData(d.data()));
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tokens'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const loaded = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      loaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTokens(loaded);
    });
    return () => unsub();
  }, [user]);

  const handleLogout = async () => { await signOut(auth); navigate('/'); };

  const handleGenerateToken = async () => {
    const credits = userData?.credits || 0;
    if (credits < 1) { alert('Credit tidak cukup!'); setShowPackageModal(true); return; }
    if (!confirm('Gunakan 1 Credit?')) return;
    setIsGenerating(true);
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists() || (userDoc.data().credits || 0) < 1) throw new Error('Credit tidak valid.');
        const tokenCode = `UTBK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const tokenRef = doc(db, 'tokens', tokenCode);
        transaction.update(userRef, {
          credits: (userDoc.data().credits || 0) - 1,
          generatedTokens: [...(userDoc.data().generatedTokens || []), tokenCode],
        });
        transaction.set(tokenRef, {
          tokenCode, userId: user.uid,
          studentName: userDoc.data().displayName,
          studentSchool: userDoc.data().school,
          studentPhone: userDoc.data().phone || user.email,
          status: 'active', score: null,
          createdAt: new Date().toISOString(),
          isSent: true, sentMethod: 'DASHBOARD_GENERATE',
        });
      });
      alert('Token berhasil dibuat!');
    } catch (error) { alert('Gagal: ' + error); }
    finally { setIsGenerating(false); }
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
            <img src="/LogoRuangSimulasi.svg" alt="Logo" className="w-28 h-28 object-contain drop-shadow-lg bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl ring-1 ring-white/50"/>
            <div>
              <h1 className="text-2xl font-bold">Halo, {userData?.displayName?.split(' ')[0] || 'Siswa'} 👋</h1>
              <p className="text-indigo-200 text-sm mt-1">Siap untuk simulasi hari ini?</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition text-white"><LogOut size={20}/></button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-10 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl flex justify-between items-center border border-gray-100">
          <div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sisa Credit</p>
            <p className="text-4xl font-black text-gray-800">{userData?.credits || 0}</p>
          </div>
          <button onClick={() => setShowPackageModal(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition flex items-center gap-2"><Plus size={18}/> Top Up</button>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-6 text-center">
          <h3 className="font-bold text-indigo-900 mb-2 text-lg">Mulai Simulasi Baru</h3>
          <p className="text-indigo-600/70 text-sm mb-6">Gunakan 1 credit untuk token ujian.</p>
          <button
            onClick={handleGenerateToken}
            disabled={isGenerating}
            className="w-full bg-white text-indigo-600 py-3.5 rounded-xl font-bold shadow-sm hover:shadow-md transition flex items-center justify-center gap-2 border border-indigo-100"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20}/> : <Ticket size={20}/>}
            {isGenerating ? 'Memproses...' : 'Generate Token (-1 Credit)'}
          </button>
        </div>

        <div>
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2 px-2"><History size={20} className="text-gray-400"/> Riwayat Token</h3>
          <div className="space-y-3">
            {tokens.length === 0 && (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center text-gray-400 text-sm">Belum ada riwayat ujian.</div>
            )}
            {tokens.map((t) => (
              <div key={t.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 transition hover:shadow-md">
                <div className="text-center md:text-left">
                  <div className="font-mono font-bold text-lg text-indigo-600 tracking-wider">{t.tokenCode}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(t.createdAt).toLocaleString('id-ID')}</div>
                  {t.score !== null && t.score !== undefined && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold"><Trophy size={12}/> Skor: {t.score}</div>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button onClick={() => { navigator.clipboard.writeText(t.tokenCode); alert('Token disalin!'); }} className="p-2 border rounded-lg hover:bg-gray-50 text-gray-500" title="Salin Token"><Copy size={18}/></button>
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

      {showPackageModal && <PackageSelection user={user} onClose={() => setShowPackageModal(false)}/>}
    </div>
  );
};

export default Dashboard;
