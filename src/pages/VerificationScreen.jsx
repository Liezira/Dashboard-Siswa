import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, RefreshCw, AlertTriangle } from 'lucide-react';

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
      alert('Email terkirim! CEK FOLDER SPAM/JUNK.');
    } catch {
      alert('Tunggu sebentar sebelum kirim ulang.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl text-center border border-gray-100">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="text-yellow-600 w-10 h-10"/>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifikasi Email</h2>
        <p className="text-gray-500 mb-6 text-sm leading-relaxed">Halo <b>{user.displayName}</b>, cek emailmu ({user.email}) dan klik link verifikasi.</p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-6 flex items-start gap-3 text-left">
          <AlertTriangle className="text-orange-500 w-5 h-5 flex-shrink-0 mt-0.5"/>
          <p className="text-xs text-orange-700 leading-snug"><b>Tidak ada email?</b> Cek folder <b>SPAM</b> atau <b>JUNK</b>.</p>
        </div>
        <div className="space-y-3">
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2">
            <RefreshCw size={18}/> Saya Sudah Klik Link
          </button>
          <button onClick={handleResend} disabled={loading || sent} className="w-full py-3 bg-white border-2 border-indigo-100 text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition">
            {loading ? 'Mengirim...' : sent ? 'Email Terkirim (Cek Spam)' : 'Kirim Ulang Email'}
          </button>
          <button onClick={async () => { await signOut(auth); navigate('/'); }} className="text-gray-400 text-sm hover:text-red-500 underline mt-4">
            Keluar / Ganti Akun
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
