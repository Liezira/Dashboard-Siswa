import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

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

export default VerifyEmailPage;
