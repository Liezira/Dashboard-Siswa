// RuangSimulasi App Constants
export const EXAM_URL = "https://utbk-simulation-tester-student.vercel.app";

export const PACKAGES = [
  {
    name: 'Paket Hemat', subtitle: 'Coba dulu sebelum serius', credits: 1,
    price: "10.000", originalPrice: null,
    description: '1 Token untuk 1x simulasi UTBK',
    features: ['1 Token Ujian Simulasi', 'Analisis Nilai Dasar', 'Akses Leaderboard'],
    color: "from-blue-500 to-cyan-500", popular: false,
  },
  {
    name: 'Paket Pejuang', subtitle: 'Paling seimbang & paling dipilih', credits: 3,
    price: "25.000", originalPrice: "30.000",
    description: '3 Token untuk latihan intensif',
    features: ['3 Token Ujian Simulasi', 'Analisis Nilai & Ranking Akurat', 'Leaderboard Nasional'],
    color: "from-purple-500 to-pink-500", popular: true,
  },
  {
    name: 'Paket Sultan', subtitle: 'Paling hemat untuk pejuang serius', credits: 10,
    price: "75.000", originalPrice: "100.000",
    description: '10 Token untuk persiapan maksimal',
    features: ['10 Token Ujian Simulasi', 'Analisis Lengkap & Riwayat', 'Leaderboard Nasional'],
    color: "from-orange-500 to-red-500", popular: false,
  },
];

export const FEATURES = [
  { colorClass: "from-blue-500 to-cyan-500",     title: "Soal Berkualitas Tinggi",    description: "Ribuan soal berkualitas yang disusun oleh tim expert sesuai kisi-kisi UTBK terbaru." },
  { colorClass: "from-purple-500 to-pink-500",   title: "Analisis Performa",          description: "Setiap simulasi langsung dipecah: subtest lemah, waktu terbuang, dan potensi naik skor." },
  { colorClass: "from-orange-500 to-red-500",    title: "Leaderboard Real-time",      description: "Bandingkan skormu dengan ribuan peserta lain dan lacak perkembanganmu." },
  { colorClass: "from-green-500 to-emerald-500", title: "Sistem Aman & Terpercaya",   description: "Fullscreen mode dengan deteksi kecurangan untuk simulasi ujian yang realistis." },
  { colorClass: "from-indigo-500 to-blue-500",   title: "Timer Akurat",               description: "Sistem timer yang presisi untuk melatih manajemen waktu seperti ujian sesungguhnya." },
  { colorClass: "from-yellow-500 to-orange-500", title: "Akses Fleksibel",            description: "Kerjakan kapan saja, dimana saja. Token valid 24 jam setelah diaktifkan." },
];

export const TESTIMONIALS = [
  { name: "Fayla Zanatun Zahir", school: "SMA Negeri 9 Kota Tangerang Selatan", text: "Bagus banget!, tampilan dan suasananya mirip kaya UTBK beneran.", rating: 5, avatar: "🎓" },
  { name: "Ravin Syach", school: "SMK Negeri 19 JAKARTA (Gapyear)", text: "Overall bagus sih antarmukanya udah berasa ngerjain real UTBK. Highly recommended untuk persiapan UTBK.", rating: 5, avatar: "📚" },
  { name: "Damar Fathan Nugraha", school: "SMA Negeri 9 Kota Tangerang", text: "Timer dan fullscreen mode bikin latihan jadi realistis. Pas ujian beneran nanti udah gak grogi lagi!", rating: 5, avatar: "🏆" },
];

export const FAQS = [
  { question: "Bagaimana cara menggunakan platform ini?", answer: "Sangat mudah! Cukup daftar akun, beli credits sesuai kebutuhan, generate token, dan mulai ujian. Setiap token valid 24 jam sejak diaktifkan." },
  { question: "Apakah soal-soalnya mirip dengan UTBK asli?", answer: "Ya! Soal-soal kami disusun oleh tim expert yang mengacu pada kisi-kisi UTBK terbaru." },
  { question: "Berapa lama token berlaku?", answer: "Setiap token berlaku selama 24 jam sejak pertama kali diaktifkan." },
  { question: "Apakah credits bisa hangus?", answer: "Credits akan hangus jika tidak digunakan dalam 3 bulan sejak pembelian." },
  { question: "Bagaimana sistem pembayarannya?", answer: "Pembayaran bisa dilakukan via direct WhatsApp yang otomatis ketika kamu mau beli paket." },
  { question: "Apakah ada garansi uang kembali?", answer: "Maaf, credits yang sudah dibeli tidak bisa di-refund. Namun kami menjamin kualitas platform." },
  { question: "Apakah semua paket punya fitur yang sama?", answer: "Ya. Semua paket mendapatkan fitur dan kualitas yang sama. Perbedaannya hanya jumlah token." },
];
