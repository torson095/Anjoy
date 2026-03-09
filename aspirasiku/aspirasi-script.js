// 1. Import library Firebase versi 12.10.0 (Sesuai dengan project-mu)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// 2. Konfigurasi Firebase OSIS SMANSAWANA
const firebaseConfig = {
  apiKey: "AIzaSyAcT4oWQM5kp-LaEZClmp7jJYI5DXzPKVs",
  authDomain: "osissmansawana-98be3.firebaseapp.com",
  projectId: "osissmansawana-98be3",
  storageBucket: "osissmansawana-98be3.firebasestorage.app",
  messagingSenderId: "87266696754",
  appId: "1:87266696754:web:cd9bb143ebadb43c51262b"
};

// 3. Menyalakan Mesin Firebase dan Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. Mengambil elemen dari HTML
const formAspirasi = document.getElementById("FormAspirasi");
const inputPesan = document.getElementById("PesanAspirasi");
const tombolKirim = document.getElementById("KirimAspirasi");

// 5. Logika Pengiriman Anti-Refresh (Solusi Bug Kemarin)
formAspirasi.addEventListener("submit", async function(event) {
  // Mencegah browser refresh otomatis
  event.preventDefault(); 

  const isiPesan = inputPesan.value.trim();

  // Cegah pesan kosong
  if (isiPesan === "") {
    alert("Pesan aspirasi tidak boleh kosong!");
    return;
  }

  // Efek Loading UX
  const teksTombolAsli = tombolKirim.innerText;
  tombolKirim.innerText = "Mengirim...";
  tombolKirim.disabled = true;

  try {
    // Proses kirim ke koleksi 'aspirasi_masuk'
    await addDoc(collection(db, "aspirasi_masuk"), {
      pesan: isiPesan,
      waktu_kirim: serverTimestamp() 
    });

    // Notifikasi berhasil
    alert("Aspirasi terkirim!");
    formAspirasi.reset(); // Kosongkan form

  } catch (error) {
    // Tangkap error jika gagal
    console.error("Error detail: ", error);
    alert("Gagal mengirim, coba lagi.");
  } finally {
    // Kembalikan tombol ke semula
    tombolKirim.innerText = teksTombolAsli;
    tombolKirim.disabled = false;
  }
});


