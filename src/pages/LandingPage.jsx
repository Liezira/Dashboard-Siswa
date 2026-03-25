import React, { useState } from 'react';
import { Star, ChevronDown, Check } from 'lucide-react';
import AuthModal from '../AuthModal';
import { PACKAGES, FEATURES, TESTIMONIALS, FAQS } from '../constants/config';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pt-24 pb-40 overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 50%, #fff 1px, transparent 1px)', backgroundSize: '50px 50px'}}/>
        <div className="max-w-5xl mx-auto text-center px-4 relative z-10">
          <img src="/LogoRuangSimulasi.svg" alt="RuangSimulasi" className="w-28 h-28 mx-auto mb-6 animate-bounce-slow" />
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
            Latihan UTBK <br/>
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Serius. Realistis. Percaya Diri.</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform simulasi UTBK terlengkap dengan soal berkualitas, timer akurat, fullscreen mode, dan analisis nilai real-time.
          </p>
          <button onClick={() => setShowAuth(true)} className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-10 py-4 rounded-full font-black text-xl shadow-2xl hover:scale-105 transition-transform duration-200">
            Mulai Simulasi Gratis →
          </button>
          <p className="text-indigo-300 text-sm mt-4">Sudah ribuan siswa di seluruh Indonesia berlatih di sini.</p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-3 gap-4">
          {[['10.000+', 'Soal Berkualitas'], ['500+', 'Siswa Aktif'], ['4.9/5', 'Rating App']].map(([v, l]) => (
            <div key={l} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 text-center">
              <div className="text-2xl md:text-3xl font-black text-indigo-700">{v}</div>
              <div className="text-gray-500 text-xs md:text-sm mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="py-24 px-4 bg-gray-50 mt-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Kenapa RuangSimulasi?</h2>
          <p className="text-gray-500 text-center mb-12">Lebih dari sekadar latihan soal biasa.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-6 rounded-2xl shadow border border-gray-100 hover:shadow-lg transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.colorClass} flex items-center justify-center mb-4`}>
                  <span className="text-white font-bold text-xl">✓</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Pilih Paket Kamu</h2>
          <p className="text-gray-500 text-center mb-12">Bayar sekali, latihan berkali-kali. Tidak ada biaya berlangganan.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className={`relative rounded-3xl p-7 text-white bg-gradient-to-br ${pkg.colorClass} shadow-xl flex flex-col hover:scale-105 transition-transform duration-200`}>
                {pkg.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase shadow">TERLARIS 🔥</div>}
                <div>
                  <h3 className="text-xl font-black">{pkg.name}</h3>
                  <p className="text-white/70 text-sm mb-4">{pkg.subtitle}</p>
                  <div className="text-5xl font-black mb-1">Rp {pkg.price}</div>
                  {pkg.originalPrice && <div className="text-sm text-white/60 line-through mb-4">Rp {pkg.originalPrice}</div>}
                  <div className="font-bold text-lg text-white/90 mb-4">{pkg.credits} Token Ujian</div>
                </div>
                <ul className="space-y-2 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/90">
                      <Check size={14} className="text-white mt-0.5 flex-shrink-0"/>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setShowAuth(true)} className="mt-auto w-full py-3 bg-white/20 hover:bg-white/30 border border-white/50 rounded-xl font-bold text-white backdrop-blur-sm transition">
                  Pilih Paket Ini
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-4">Kata Mereka</h2>
          <p className="text-gray-500 text-center mb-12">Jujur dari siswa yang sudah berlatih.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white p-6 rounded-2xl border border-gray-100 shadow hover:shadow-lg transition">
                <div className="flex gap-1 mb-3">{Array(t.rating).fill(null).map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400"/>)}</div>
                <p className="text-gray-700 text-sm italic mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t pt-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-xl">{t.avatar}</div>
                  <div><div className="font-bold text-gray-800 text-sm">{t.name}</div><div className="text-xs text-gray-500">{t.school}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-center text-gray-900 mb-12">Pertanyaan Umum</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow transition">
                <button
                  className="w-full text-left p-5 flex justify-between items-center font-bold text-gray-800"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                >
                  {f.question}
                  <ChevronDown size={18} className={`flex-shrink-0 transition-transform duration-300 ${openFAQ === i ? 'rotate-180' : ''}`}/>
                </button>
                {openFAQ === i && <div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">{f.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black mb-4">Siap Mulai Latihan?</h2>
          <p className="text-indigo-200 mb-8">Bergabung dengan ribuan siswa yang sudah lebih siap menghadapi UTBK.</p>
          <button onClick={() => setShowAuth(true)} className="bg-white text-indigo-700 px-10 py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
            Daftar Sekarang — Gratis →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-center text-gray-500 text-sm">
        <img src="/LogoRuangSimulasi.svg" alt="RS" className="w-10 mx-auto mb-4"/>
        <p>© {new Date().getFullYear()} RuangSimulasi. Semua hak dilindungi.</p>
      </footer>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)}/>}
    </div>
  );
};

export default LandingPage;
