// 1. Menggunakan versi 12.10.0 sesuai config barumu
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, query, orderBy, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// --- CONFIG FIREBASE TERBARU (OSIS SMANSAWANA) ---
const firebaseConfig = {
    apiKey: "AIzaSyAcT4oWQM5kp-LaEZClmp7jJYI5DXzPKVs",
    authDomain: "osissmansawana-98be3.firebaseapp.com",
    projectId: "osissmansawana-98be3",
    storageBucket: "osissmansawana-98be3.firebasestorage.app",
    messagingSenderId: "87266696754",
    appId: "1:87266696754:web:cd9bb143ebadb43c51262b"
};

// Menyalakan Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Ambil elemen HTML
const inboxDiv = document.getElementById('inbox');
const btnRefresh = document.getElementById('btnRefresh');

// FUNGSI LOAD DATA
async function muatPesan() {
    inboxDiv.innerHTML = "<p class='status-text' style='grid-column: 1/-1; text-align: center;'>Memeriksa kotak surat...</p>";
    
    try {
        const q = query(collection(db, "aspirasi_masuk"), orderBy("waktu_kirim", "desc"));
        const snapshot = await getDocs(q);
        inboxDiv.innerHTML = ""; 

        if (snapshot.empty) {
            inboxDiv.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Kotak surat kosong.</p>";
            return;
        }

        let tanggalTerakhir = ""; // Variabel untuk menyimpan tanggal pembanding

        snapshot.forEach((messageDoc) => {
            const data = messageDoc.data();
            const id = messageDoc.id;
            
            const dateObj = data.waktu_kirim ? data.waktu_kirim.toDate() : new Date();
            
            // Format tanggal untuk pembanding (misal: "8 Maret 2026")
            const opsiTanggal = { day: 'numeric', month: 'long', year: 'numeric' };
            const tanggalSekarang = dateObj.toLocaleDateString('id-ID', opsiTanggal);
            const jam = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

            // LOGIKA SEKAT: Jika tanggal berbeda dengan pesan sebelumnya, buat elemen sekat
            if (tanggalSekarang !== tanggalTerakhir) {
                const divider = document.createElement('div');
                divider.className = 'date-divider';
                divider.innerHTML = `<span> ${tanggalSekarang}</span>`;
                inboxDiv.appendChild(divider);
                
                tanggalTerakhir = tanggalSekarang; // Update tanggal pembanding
            }

            const card = document.createElement('div');
            card.className = 'mail-card';
            card.innerHTML = `
                <div class="postcard" id="capture-${id}">
                    <div class="airmail-strip"></div>
                    <div class="postcard-body">
                        <div class="stamp-mark">
                            <i class="fa-solid fa-paper-plane"></i>
                            <span>${dateObj.toLocaleDateString('id-ID', {day:'numeric', month:'short'})}</span>
                            <span>${jam}</span>
                        </div>
                        <div class="message-content">
                            <p class="message-text">"${data.pesan}"</p>
                        </div>
                        <div class="postcard-footer">
                            <div class="branding">
                                <svg width="30" height="30" style="color: inherit;">
                                    <use href="../svg-icons/icons.svg#Aspirasiku"></use>
                                </svg>Aspirasiku
                            </div>
                            <div>#osissmansawana</div>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="action-btn btn-download" data-id="${id}"><i class="fa-solid fa-camera"></i> Simpan</button>
                </div>
            `;
            inboxDiv.appendChild(card);
        });

        tambahEventListenerTombol();

    } catch (e) {
        console.error("Gagal muat data: ", e);
        inboxDiv.innerHTML = "<p style='text-align: center; color: red;'>Akses ditolak.</p>";
    }
}

function tambahEventListenerTombol() {
    document.querySelectorAll('.btn-download').forEach(btn => {
        btn.onclick = () => unduhPesan(btn.getAttribute('data-id'));
    });
}

// FUNGSI DOWNLOAD (Menggunakan html2canvas)
window.unduhPesan = (id) => {
    const element = document.getElementById(`capture-${id}`);
    html2canvas(element, { scale: 3, backgroundColor: "#ffffff" }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Aspirasi-${id}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    });
};

btnRefresh.onclick = muatPesan;
muatPesan();
